"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = __importDefault(require("crypto"));
var elliptic_1 = __importDefault(require("elliptic"));
var EC = new elliptic_1.default.ec('secp256k1');
var Transaction = /** @class */ (function () {
    function Transaction(transaction) {
        var _this = this;
        this.transaction = transaction;
        this.calculateTransactionHash = function () {
            return crypto_1.default.createHash('sha256').update(_this.transaction.fromAdd + _this.transaction.timestamp + _this.transaction.toAdd + _this.transaction.amount).digest('hex');
        };
        this.signTransaction = function (signingKey) {
            if (signingKey.getPublic('hex') !== _this.transaction.fromAdd) {
                throw new Error('Wallet is not yours.');
            }
            var hashTx = _this.calculateTransactionHash();
            var sig = signingKey.sign(hashTx, 'base64');
            _this.transaction.signature = sig.toDER('hex');
        };
        this.isValid = function () {
            if (_this.transaction.fromAdd === null)
                return true;
            if (!_this.transaction.signature || _this.transaction.signature.length === 0) {
                throw new Error('No signature yet in this transaction');
            }
            var publicKey = EC.keyFromPublic(_this.transaction.fromAdd, 'hex');
            return publicKey.verify(_this.calculateTransactionHash(), _this.transaction.signature);
        };
        transaction.timestamp = String(Date.now());
        transaction.transactionHash = this.calculateTransactionHash();
    }
    return Transaction;
}());
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map