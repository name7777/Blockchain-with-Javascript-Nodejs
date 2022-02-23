const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid'); // uuid: 유일무이한 무작위 문자열을 반들어냄 -> 채굴 보상인 bitcoin을 주기 위해 통신할 네트워크 노드의 주소로 사용하기 위함

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const bitcoin = new Blockchain();

// 1) 엔드포인트를 호출하는 누구에게나 블록체인 전체를 보여줌
app.get('/blockchain', function(req, res) {
    res.send(bitcoin);
});

// 2) 사용자가 transaction 사용 시 createNewTransaction 메소드에 저장하고 알림을 해줌
app.post('/transaction', function(req, res) {
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({ note: `Transaction will be added in block ${blockIndex}.` })
});

// 3) 새로운 블록을 생성하고 채굴
app.get('/mine', function(req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.penddingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    res.json({
        block: newBlock,
        note: "New block mined successfully."
    });

    const nodeAddress = uuid().split('-').join('');
    bitcoin.createNewTransaction(12.5, "00", nodeAddress); // 18년 bitcoin 반감기 기준 채굴 보상 = 12.5코인
});

const port = 3000;

app.listen(port, function() {
    console.log(`Server is running at http://localhost:${port}/blockchain`)
});