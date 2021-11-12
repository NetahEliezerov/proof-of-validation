"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
var crypto_1 = __importDefault(require("crypto"));
var Transaction_1 = __importDefault(require("./Transaction"));
var axios_1 = __importDefault(require("axios"));
// proof of validation
var Block = /** @class */ (function () {
    function Block(block) {
        var _this = this;
        this.block = block;
        this.calculateBlockAndValidationHash = function () {
            return crypto_1.default.createHash('sha256').update(JSON.stringify(_this.block)).digest('hex');
        };
        var blockHash = this.calculateBlockAndValidationHash();
        block.hash = blockHash;
        block.validationHash = blockHash;
    }
    return Block;
}());
var Blockchain = /** @class */ (function () {
    function Blockchain() {
        var _this = this;
        this.blockChain = [new Block({ index: 0, timestamp: JSON.stringify(Date.now()), previousBlockHash: '0', transactions: [], nounce: 1, hash: '0', validationHash: '' })];
        this.nodes = [{ ip: 'http://localhost:6144' }];
        this.registerNode = function (node) {
            return _this.nodes.push(node);
        };
        this.getRecentBlock = function () {
            return _this.blockChain[_this.blockChain.length];
        };
        this.getLastBlock = function () {
            return _this.blockChain[_this.blockChain.length - 1];
        };
        this.createNewTransaction = function (fromAdd, toAdd, amount) {
            if (amount <= 0) {
                throw new Error('Transaction amount is below 0');
            }
            if (_this.getBalanceOfWallet(fromAdd) < amount) {
                throw new Error('Not enough funds to send money');
            }
            var newTransactionData = { fromAdd: fromAdd, toAdd: toAdd, amount: amount, timestamp: String(Date.now()), transactionHash: '0', signature: '5' };
            var newTransaction = new Transaction_1.default(newTransactionData);
            _this.tempLedger.push(new Transaction_1.default(newTransactionData));
        };
        this.getBalanceOfWallet = function (address) {
            var balance = 0;
            for (var _i = 0, _a = _this.blockChain; _i < _a.length; _i++) {
                var block = _a[_i];
                for (var _b = 0, _c = block.block.transactions; _b < _c.length; _b++) {
                    var trans = _c[_b];
                    if (trans.fromAdd === address) {
                        balance -= trans.amount;
                    }
                    if (trans.toAdd === address) {
                        balance += trans.amount;
                    }
                }
            }
            return balance;
        };
        this.validateNewBlock = function () {
            var currentBlock = _this.getRecentBlock();
            var validationHashes = [];
            var mostUsedBlocks = [];
            _this.nodes.forEach(function (node, nodeIdx) {
                axios_1.default.get(node.ip + "/getCurrentBlock").then(function (res) {
                    validationHashes.push([res.data.validationHash, res.data]);
                });
            });
            validationHashes.forEach(function (block) {
                var foundHashes = validationHashes.find;
            });
        };
        this.printChain = function () {
            return console.log(_this.blockChain);
        };
    }
    return Blockchain;
}());
exports.Blockchain = Blockchain;
//# sourceMappingURL=blockchain.js.map