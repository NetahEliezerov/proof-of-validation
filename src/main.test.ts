import {Blockchain} from './blockchain';
import Elliptic from 'elliptic';

const EC = new Elliptic.ec('secp256k1');

// const blockchain = new Blockchain();

const KeyPair = EC.genKeyPair();

console.log(KeyPair.getPrivate('hex'));
console.log(KeyPair.getPublic('hex'));
