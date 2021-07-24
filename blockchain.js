const SHA256=require('crypto-js/sha256')
const EC=require('elliptic').ec;
const ec=new EC('secp256k1');



class transactions{
    constructor(from,to,amount){
this.from=from;
this.to=to;
this.amount=amount;
    }
calculateHash=()=>{
    return SHA256(this.from+this.to+this.amount).toString()
}

signTransaction=(signingKey)=>{
if(signingKey.getPublic('hex')!==this.from){
    throw new Error("you can't sign to other wallets")
}


    const hashTx=this.calculateHash()
    const sig=signingKey.sign(hashTx,'base64')
    this.signature=sig.toDER('hex')

}


isValid=()=>{

    if(this.from===null) return true;

    if(!this.signature ||  this.signature.length===0){

        throw new Error('No  signature in this transaction')
    }

    const publicKey=ec.keyFromPublic(this.from,'hex')
    return publicKey.verify(this.calculateHash(),this.signature)


}


}



class Block{
constructor(timestamp,transactions,previousHash=''){

    this.timestamp=timestamp;
    this.transactions=transactions;
    this.previousHash=previousHash;
    this.hash=this.calculateHash();
    this.nonce=0;
}
calculateHash=()=>{
return SHA256(this.index+this.previousHash+this.timestamp+JSON.stringify(this.data)+this.nonce).toString()
}

mineBlock=(difficulty)=>{
while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join('0')){
    this.nonce++
this.hash=this.calculateHash()
}
console.log('block mined---'+this.hash)
}

hasValidTransactions=()=>{
for(const tx of this.transactions){
if(!tx.isValid()){

return false;
}


}
return true;
}

}



class BlockChain{
constructor(){
this.chain=[this.createGenesisBlock()];
this.difficulty=2;
this.pendingTransactions=[];
this.miningReward=100

}
createGenesisBlock=()=>{

    return new Block('01/07/2021','Genesis block','0')
}

getLatestBlock=()=>{
    return this.chain[this.chain.length-1]
}

minePendingTransactions=(miningRewardAddress)=>{
let block=new Block(Date.now(),this.pendingTransactions)
block.mineBlock(this.difficulty)

console.log('block successfully mined')
this.chain.push(block)
this.pendingTransactions=[
    new transactions(null,miningRewardAddress,this.miningReward)
]
}

addTransaction=(transaction)=>{

    if(!transaction.from  || !transaction.to){

        throw new Error('transaction must include from and to address')

    }
    if(!transaction.isValid()){
throw new Error('can not add invalid transaction to chain')
    }



this.pendingTransactions.push(transaction)

}

getBalanceOfAddress=(address)=>{
let balance=0;

for(const block of this.chain){
for(const trans of block.transactions){
    if(address===trans.from){
        balance -=trans.amount
    }
    if(address ===trans.to){
        balance +=trans.amount
    }
}

}

return balance

}


isChainValid=()=>{
for(let i=1;i<this.chain.length;i++){
   const currentBlock=this.chain[i];
   const previousBlock=this.chain[i-1];


if(currentBlock.hash !== currentBlock.calculateHash() ){

return false
}
else if(!currentBlock.hasValidTransactions()){
  return false

}
else if(currentBlock.previousHash  !== previousBlock.hash){
    return false
}
else{
    return true
}


}




}


}


module.exports.BlockChain=BlockChain;
module.exports.transactions=transactions;
