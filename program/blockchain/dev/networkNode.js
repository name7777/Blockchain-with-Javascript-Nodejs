const port = process.argv[2];
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const { v1: uuid } = require('uuid'); // uuid: 유일무이한 무작위 문자열을 반들어냄 -> 채굴 보상인 bitcoin을 주기 위해 통신할 네트워크 노드의 주소로 사용하기 위함
const rp = require('request-promise'); // broadcast를 위한 라이브러리

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const bitcoin = new Blockchain();

// 1) 엔드포인트를 호출하는 누구에게나 블록체인 전체를 보여줌
app.get('/blockchain', (req, res) => {
    res.send(bitcoin);
});

// 2) 사용자가 transaction 사용 시 createNewTransaction 메소드에 저장하고 알림을 해줌
app.post('/transaction', (req, res) => {
	const newTransaction = req.body;
	const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
	res.json({ note: `Transaction will be added in block ${blockIndex}.` });
});

// 3) 새로운 블록을 생성하고 채굴
app.get('/mine', (req, res) => {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };
    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);
    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    const nodeAddress = uuid().split('-').join('');
    bitcoin.createNewTransaction(12.5, "00", nodeAddress); // 18년 bitcoin 반감기 기준 채굴 보상 = 12.5코인
    
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);
	
	const requestPromises = []; // 밑에서 push로 promise를 담을 배열
	bitcoin.networkNodes.forEach(networkNodeUrl => { // newBlock을 다른 모든 노드에게 broadcast하는 기능
		const requestOptions = {
			uri: networkNodeUrl + '/receive-new-block',
			method: 'POST',
			body: { newBlock: newBlock },
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		const requestOptions = {
			uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
			method: 'POST',
			body: {
				amount: 12.5,
				sender: "00",
				recipient: nodeAddress
			},
			json: true
		};

		return rp(requestOptions);
	})
	.then(data => {
		res.json({
			note: "New block mined & broadcast successfully",
			block: newBlock
		});
	});
});

// mine 엔드포인트에서 업데이트한 내용을 받아 새 정보를 구축하는 곳
app.post('/receive-new-block', (req, res) => { //
	const newBlock = req.body.newBlock;
	const lastBlock = bitcoin.getLastBlock(); // 위 newBlock이 실제 블록인지, 체인에 제대로 맞는지 확인하기 위해 마지막 블록의 hash를 불러옴
	const correctHash = lastBlock.hash == newBlock.previousBlockHash; // 1차 점검
	const correctIndex = lastBlock['index'] + 1 === newBlock['index']; // 2차 점검 - 새로 생성 된 block은 lastBlock의 index에 포함 되어야 하므로 이 논리식을 채택

	if(correctHash && correctIndex) {
		bitcoin.chain.push(newBlock);
		bitcoin.pendingTransactions = []; // chain에 block을 추가(갱신)했으므로 미결 트랜잭션은 다시 초기화
		res.json({
			note: 'New block received and accepted.',
			newblock: newBlock
		});
	}
	else {
		res.json({
			note: 'New block rejected',
			newBlock: newBlock
		});
	}
});

// 네트워크
// 1) 새 노드를 자체 등록한 후 새 노드를 네트워크 내의 다른 모든 노드에게 broadcast함
app.post('/register-and-broadcast-node', (req, res) => {
	const newNodeUrl = req.body.newNodeUrl;
	if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1) bitcoin.networkNodes.push(newNodeUrl);

	const regNodesPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/register-node',
			method: 'POST',
			body: { newNodeUrl: newNodeUrl },
			json: true
		};

		regNodesPromises.push(rp(requestOptions));
	});

	Promise.all(regNodesPromises)
	.then(data => {
		const bulkRegisterOptions = {
			uri: newNodeUrl + '/register-nodes-bulk',
			method: 'POST',
			body: { allNetworkNodes: [ ...bitcoin.networkNodes, bitcoin.currentNodeUrl ] },
			json: true
		};

		return rp(bulkRegisterOptions);
	})
	.then(data => {
		res.json({ note: 'New node registered with network successfully.' });
	});
});

// 2) register-node: 새로운 네트워크 노드를 받아들이기만 함(broadcast X)
app.post('/register-node', (req, res) => {
	const newNodeUrl = req.body.newNodeUrl;
	const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
	const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
	if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
	res.json({ note: 'New node registered successfully.' });
});

// 3) 이미 네트워크에 존재하는 모든 노드들의 URL을 받아 새로운 노드에 등록
app.post('/register-nodes-bulk', (req, res) => {
	const allNetworkNodes = req.body.allNetworkNodes;
	allNetworkNodes.forEach(networkNodeUrl => {
		const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
		const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
		if (nodeNotAlreadyPresent && notCurrentNode) bitcoin.networkNodes.push(networkNodeUrl);
	});

	res.json({ note: 'Bulk registration successful.' });
});

// 4) /transaction/broadcast: 1) 새 트랜잭션을 생성 2) 생성한 새 트랜잭션을 네트워크의 다른 모든 노드에 broadcast
app.post('/transaction/broadcast', function(req, res) {
	const newTransaction = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
	bitcoin.addTransactionToPendingTransactions(newTransaction);

	const requestPromises = [];
	bitcoin.networkNodes.forEach(networkNodeUrl => {
		const requestOptions = {
			uri: networkNodeUrl + '/transaction',
			method: 'POST',
			body: newTransaction,
			json: true
		};

		requestPromises.push(rp(requestOptions));
	});

	Promise.all(requestPromises)
	.then(data => {
		res.json({ note: 'Transaction created and broadcast successfully.' });
	});
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/blockchain`)
});
