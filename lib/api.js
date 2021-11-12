"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var blockchain_1 = require("./blockchain");
var axios_1 = __importDefault(require("axios"));
var body_parser_1 = __importDefault(require("body-parser"));
var express_1 = __importDefault(require("express"));
var app = (0, express_1.default)();
var blockchain = new blockchain_1.Blockchain();
app.use((0, body_parser_1.default)());
app.get('/blockchain', function (req, res) {
    res.send(blockchain);
});
app.post('/transaction', function (req, res) {
    var newTransaction = req.body;
    blockchain.createNewTransaction(newTransaction.from, newTransaction.to, newTransaction.amount);
    res.json(true);
});
app.post('/transaction/broadcast', function (req, res) {
    blockchain.createNewTransaction(req.body.from, req.body.to, req.body.amount);
    var requestPromises = [];
    blockchain.nodes.forEach(function (networkNode) {
        axios_1.default.post(networkNode.ip + "/transaction", { from: req.body.from, to: req.body.to, amount: req.body.amount })
            .then(function (res) {
            requestPromises.push(res.data);
        });
    });
    res.send('Transaction recorded.');
});
app.post('/register-node', function (req, res) {
    if (!req.body.ip) {
        blockchain.registerNode({ ip: req.body.ip });
    }
});
app.get('/getCurrentBlock', function (req, res) {
    res.send(blockchain.getRecentBlock());
});
app.get('validateNewBlock', function (req, res) {
    var lastBlock = blockchain.getLastBlock();
    var previousBlockHash;
});
app.listen(6144, function () {
    console.log('Node listening on port 6144');
});
//# sourceMappingURL=api.js.map