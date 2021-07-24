const {BlockChain,transactions}=require('./blockchain')
const EC=require('elliptic').ec;
const ec=new EC('secp256k1');



const myKey=ec.keyFromPrivate('1df8f0021f38e0cc86d042e0607818da3e1e4f99783a9e24fb2a7bcae938772c')
const myWalletAddress=myKey.getPublic('hex')



let ssCoin=new BlockChain()

const tx1=new transactions(myWalletAddress,'public key goes here',10)
tx1.signTransaction(myKey)

ssCoin.addTransaction(tx1)

console.log('\n starting miner ...')

ssCoin.minePendingTransactions(myWalletAddress)
ssCoin.minePendingTransactions(myWalletAddress)

console.log('\n balance of wallet:',ssCoin.getBalanceOfAddress(myWalletAddress))