"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var elliptic_1 = __importDefault(require("elliptic"));
var EC = new elliptic_1.default.ec('secp256k1');
// const blockchain = new Blockchain();
var KeyPair = EC.genKeyPair();
console.log(KeyPair.getPrivate('hex'));
console.log(KeyPair.getPublic('hex'));
//# sourceMappingURL=main.test.js.map