import { TransactionType } from './typesInBlockchain';
import crypto, { sign } from 'crypto';
import Elliptic from 'elliptic';

const EC = new Elliptic.ec('secp256k1');



export default class Transaction {
    constructor(private transaction: TransactionType) {
        transaction.timestamp = String(Date.now());
        transaction.transactionHash = this.calculateTransactionHash();
        transaction.signature = "";
    }

    calculateTransactionHash = () => {
        return crypto.createHash('sha256').update(this.transaction.fromAdd + this.transaction.timestamp + this.transaction.toAdd + this.transaction.amount).digest('hex');
    }

    signTransaction = (signingKey: Elliptic.ec.KeyPair) => {
        if(signingKey.getPublic('hex') !== this.transaction.fromAdd) {
            throw new Error('Wallet is not yours.');
        }

        const hashTx = this.calculateTransactionHash();
        const sig = signingKey.sign(hashTx, 'base64');

        this.transaction.signature = sig.toDER('hex');
    }

    isValid = () => {
        if(this.transaction.fromAdd === null) return true;

        if(!this.transaction.signature || this.transaction.signature.length === 0) {
            throw new Error('No signature yet in this transaction');
        }

        const publicKey = EC.keyFromPublic(this.transaction.fromAdd, 'hex');
        return publicKey.verify(this.calculateTransactionHash(), this.transaction.signature);
    }
}
