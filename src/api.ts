import {Blockchain} from './blockchain';
import axios from 'axios';
import bodyParser from 'body-parser';
import express from 'express';

const app = express();
const blockchain = new Blockchain();

app.use(bodyParser());

app.get('/blockchain', (req, res) => {
    res.send(blockchain);
});

app.post('/transaction', (req, res) => {
    const newTransaction = req.body;
    blockchain.createNewTransaction(newTransaction.from, newTransaction.to, newTransaction.amount);
    res.json(true);
});

app.get('/tempLedger', (req, res) => {
    res.json(blockchain.getLedger());
})

app.post('/transaction/broadcast', (req, res) => {
    blockchain.createNewTransaction(req.body.from, req.body.to, req.body.amount);

    const requestPromises = [];
    blockchain.nodes.forEach(networkNode => {
        axios.post(`${networkNode.ip}/transaction`, { from: req.body.from, to: req.body.to, amount: req.body.amount })
        .then((res) => {
            requestPromises.push(res.data);
        });
    });
    res.send('Transaction recorded.');
});

app.get('/balance/:address', (req, res) => {
    res.json({ balance: blockchain.getBalanceOfWallet(req.params.address) });
})

app.post('/register-node', (req, res) => {
    if(!req.body.ip) {
        blockchain.registerNode({ ip: req.body.ip });
    }
});

app.get('/getCurrentBlock', (req, res) => {
    res.send(blockchain.getRecentBlock());
});

app.post('/addNewBlock', (req, res) => {
    const block = req.body;
    blockchain.pushNewBlock(block);
});

app.get('/validateNewBlock', (req, res) => {
    blockchain.validateNewBlock();
    res.send('Validation in progress.');
});

// setInterval(() => {
//     blockchain.validateNewBlock();
//     console.log('Validated new block');
// }, 50000);

app.listen(6144, () =>{
    console.log('Node listening on port 6144');
});
