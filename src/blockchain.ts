import crypto from 'crypto';
import { BlockType, NodeType, TransactionType } from './typesInBlockchain';
import Transaction from './Transaction';
import axios from 'axios';
import Elliptic from 'elliptic';

const EC = new Elliptic.ec('secp256k1');

function getOccurrence(array: any, value: any) {
    var count = 0;
    array.forEach((v: any) => (v === value && count++));
    return count;
}

// proof of validation

class Block {
    constructor(public block: BlockType) {
        const blockHash = this.calculateBlockAndValidationHash();
        block.hash = blockHash;
        block.validationHash = blockHash;
    }

    calculateBlockAndValidationHash = () => {
        return crypto.createHash('sha256').update(JSON.stringify(this.block)).digest('hex');
    }
}

export class Blockchain {

    public blockChain: Block[] = [new Block({ index: 0, timestamp: JSON.stringify(Date.now()),
    previousBlockHash: '0', transactions: [{fromAdd: 'omer', toAdd: '049a53f1d36ad7c060e1c6d721c31de673ac7f98bc58ca5f9a5f46c5cd9558ea7c22c397457ff7d642b52e1cffa75b0c643e3de14425badc4050c93702b99da7a6', amount: 100, timestamp: String(Date.now()),
    transactionHash: 's', signature: '21e'}], hash: '0', validationHash: '' })];

    public tempLedger: Transaction[] = [];
    public nodes: NodeType[] = [{ip: 'http://localhost:6144'}];

    constructor() {
    }

    registerNode = (node: NodeType) => {
        return this.nodes.push(node);
    }

    getRecentBlock = () => {
        return this.blockChain[this.blockChain.length - 1].block;
    }

    getLastBlock = () => {
        return this.blockChain[this.blockChain.length - 2].block;
    }

    getLedger = () => {
      return this.tempLedger;
    }

    createNewTransaction = (fromAdd: string, toAdd: string, amount: number) => {
        const fromKey = EC.keyFromPrivate(fromAdd);
        if(amount <= 0) {
            throw new Error('Transaction amount is below 0');
        }

        if(this.getBalanceOfWallet(fromKey.getPublic('hex')) < amount) {
            throw new Error('Not enough funds to send money');
        }

        const newTransactionData: TransactionType = { fromAdd: fromKey.getPublic('hex'), toAdd, amount, timestamp: String(Date.now()), transactionHash: '0', signature: '5' };

        const newTransaction = new Transaction(newTransactionData);
        newTransaction.signTransaction(fromKey);
        if(!newTransaction.isValid()) {
            throw new Error('Transaction is not valid.');
        }
        this.tempLedger.push(new Transaction(newTransactionData));
    }

    getBalanceOfWallet = (address: string) => {
        let balance = 0;

        for(const block of this.blockChain) {
            for(const trans of block.block.transactions) {
                if (trans.fromAdd === address) {
                    balance -= trans.amount;
                  }

                  if (trans.toAdd === address) {
                    balance += trans.amount;
                  }
            }
        }
        return balance;
    }

    pushNewBlock = (block: Block) => {
      this.blockChain.push(block);
      this.tempLedger = [];
    }

    validateNewBlock = () => {
        const validationHashes: any[][] = [];
        const mostUsedBlocks: any[][] = [];
        const getNodeTransactions = async () => {
          this.nodes.forEach(async (node, nodeIdx) => {
              const data = (await axios.get(`${node.ip}/tempLedger`)).data;
              const previousBlock = this.getRecentBlock();
              const trueTransactions = data.map((transaction: any) => transaction.transaction);
              const theNewBlock = new Block({ index: previousBlock.index + 1, timestamp: String(Date.now()), previousBlockHash: previousBlock.hash,
              transactions: trueTransactions, hash: '0', validationHash: '2' });
              validationHashes.push([theNewBlock.block.validationHash, theNewBlock]);
          })
        }
        getNodeTransactions().then(() => {
            validationHashes.forEach(block => {
                const numberOfTimesThatAppears = getOccurrence(validationHashes, block);
                mostUsedBlocks.push([numberOfTimesThatAppears, block]);
            })
            console.log(mostUsedBlocks[0]);
            mostUsedBlocks.sort((a,b) => a[0].localeCompare(b[0]));
            const mostUsedBlockResult = mostUsedBlocks.reverse()[0];
            this.nodes.forEach((node, nodeIdx) => {
                axios.post(`${node.ip}/addNewBlock`, mostUsedBlockResult[1][1]).then(res => {
                    console.log('Block successfully validated.');
                })
            })
        })
    }

    printChain = () => {
        return console.log(this.blockChain);
    }
}
