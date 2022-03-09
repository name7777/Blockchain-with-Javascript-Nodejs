// 블록체인의 모든 데이터 구조는 여기서 전부 개발한다
const sha256 = require('sha256');
const currentNodeUrl = process.argv[3];
const { v1: uuid } = require('uuid');

// 생성자 함수 (JS에선 class보다 생성자함수 사용을 더 선호하기에 class 대신 사용)
function Blockchain() {
    this.chain = []; // 블록체인의 핵심이 저장되는 곳
    this.pendingTransactions = []; // 블록에 아직 저장되지 않은 모든 트랜잭션들을 저장해두는 곳

    this.currentNodeUrl = currentNodeUrl;
    this.networkNodes = [];
    this.createNewBlock(100, '0', '0'); // ★ 최초의 블록인 Genesis Block을 만들기 위해 값을 임의로 넣음
};

// ★ createNewBlock: 새로운 블록을 생성하는 메소드
Blockchain.prototype.createNewBlock = function(nonce, previousBlockHash, hash) {
    const newBlock = { // ★newBlock: Blockchain 안의 새로운 블록. 모든 관련 데이터들은 이 블록 안에 저장
        index : this.chain.length + 1, // index: newBlock의 번호(index)를 매기기 위함
        timestamp : Date.now(), // timestamp: 블록이 생성 된 시점
        transactions : this.pendingTransactions, // transaction: 새로운 블록을 만들었을 때 모든 새로운 트랜잭션들과 미결 트랜잭션들을 새로운 블록에 추가하고, 이를 통해 이 트랜잭션들은 블록체인 내에 보관되어 영원히 변경되지 않게 됨
        nonce : nonce, // nonce: function 인자의 nonce와 같은 값. nonce는 작업 증명(Proof of Work) 메소드를 통해 적법하게 새로운 블록을 만들었다는 증거
        hash : hash, // hash: newBlock 객체에서 온 값. pendingTransactions를 해싱 함수에 매개변수로 전달 -> 트랜잭션들은 하나의 문자열로 압축되며 이것이 hash값이 됨 ('현재' 블록의 해시값)
        previousBlockHash : previousBlockHash, // previousBlockHash: hash 속성과 매우 유사. 다만, hash는 현재 블록의 데이터를 해싱한 값이라면 previousBlockHash는 이전 블록에서 현재 블록까지의 데이터를 해싱한 값('과거부터 현재' 블록의 해시값)
    };
    this.pendingTransactions = []; // 초기화 -> 새로운 블록을 만들 때 모든 새로운 트랜잭션들을 해당 블록에 추가하기 때문임. 그러므로 새로운 트랜잭션들의 배열을 초기화하고 그 후에 새로운 다음 블록 생성을 시작할 수 있음
    this.chain.push(newBlock); // 새로운 블록을 체인에 추가
    return newBlock; // 제일 마지막 블록을 채굴하면 다시 초기화하여 새로운 블록을 맞을 준비를 함
};

// ★ getLastBlock: 가장 마지막 블록을 반환해주는 메소드
Blockchain.prototype.getLastBlock = function() {
    return this.chain[this.chain.length - 1];
};

// ★ createNewTransaction: 새로운 트랜잭션을 생성하는 메소드
Blockchain.prototype.createNewTransaction = function(amount, sender, recipient) { // amount: 트랜잭션을 통해 송금하는 양, sender: 발송인의 주소, recipient: 수신자의 주소
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
        transactionId: uuid().split('-').join('')
    }
    return newTransaction;
};

// ★ hashBlock: 블록을 입력받아 이 블록의 데이터를 고정된 길이의 문자열로 해싱하는 일을 수행
Blockchain.prototype.hashBlock = (previousBlockHash, currentBlockdata, nonce) => { // 함수 내 인자: 값을 생성하고자 하는 블록의 데이터. 즉 메소드 내에서 해싱할 데이터들(하나의 블록으로 부터 3가지 인자가 모두 온다)
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockdata); // nonce는 숫자이기에 문자열로 변경, currentBlockdata는 하나의 객체(트랜잭션)지만 json.stringify로 문자열로 변경
    const hash = sha256(dataAsString); // 이를 통해 모든 블록 데이터(3개의 인자)로부터 해싱 값을 만듦
    return hash;
};

// ★ proofOfWork(작업증명, POW): 결국 hash를 풀기 위한 nonce값은 무엇이냐를 뜻하는 것 같음
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockdata) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockdata, nonce);
    while (hash.substring(0, 4) !== '0000') { // 우리는 해시값 앞에 0000으로 시작하는 값만 추출하길 조건을 걸었다. 0000으로 시작하는 hash값을 찾기 위해 while문을 돌린다
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockdata, nonce);
    };
    return nonce;
};

// ★ consensus algorithms(합의 알고리즘)
Blockchain.prototype.chainIsValid = function(blockchain) {
    let validChain = true;

    for (var i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const prevBlock = blockchain[i - 1];
        const blockHash = this.hashBlock( // 2차 검증: 해당 blockhash가 hash의 조건인 0000으로 시작하는지 확인하기 위해 blockHash 변수에 currentBlock의 hash값을 담음
            prevBlock['hash'],
            { transactions: currentBlock['transactions'], index: currentBlock['index'] },
            currentBlock['nonce']
        );

        // 1차 검증: 모든 해시값들이 정렬되어 있는지 확인
        if (currentBlock['previousBlockHash'] !== prevBlock['hash']) validChain = false;

        // 2차 검증: 각 블록을 다시 해시하여 blockHash 값이 4개의 0으로 시작하는지 확인
        if (blockHash.substring(0, 4) !== '0000') validChain = false;
    };

    // 3차 검증: Genesis block 검사 - index가 0번이므로 위에서 검사할 수 없으며 또한, 작업증명 없이 스스로 만들어진 블록이기에 hash가 맞는지 직접 검사해야 함
    const genesisBlock = blockchain[0];
    const correctNonce = genesisBlock['nonce'] === 100;
    const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
    const correctHash = genesisBlock['hash'] === '0';
    const correctTransactions = genesisBlock['transactions'].length === 0; // 제네시스 블록 내에 그 어떤 트랜잭션도 담겨있지 않는지 확인

    if (!correctNonce || !correctPreviousBlockHash || !correctHash || !correctTransactions) validChain = false;
    
    return validChain;
};

// Block Explorer - getBlock: 전체 블록체인에서 특정 해시 관련 블록을 검색하는 메소드
Blockchain.prototype.getBlock = function(blockHash) {
    let correctBlock = null;
    this.chain.forEach(block => {
        if (block.hash === blockHash) correctBlock = block;
    });
    return correctBlock;
};

// Block Explorer - getTransaction: transactionId를 조회하여 해당 block을 조회하는 메소드
Blockchain.prototype.getTransaction = function(transactionId) {
    let correctTransaction = null;
    let correctBlock = null;
    this.chain.forEach(block => {
        block.transactions.forEach(transaction => {
            if (transaction.transactionId === transactionId) {
                correctTransaction = transaction;
                correctBlock = block;
            };
        });
    });
    return {
        transaction: correctTransaction,
        block: correctBlock
    }
};

// Block Explorer - getAddressData
Blockchain.prototype.getAddressData = function(address) {
    const addressTransactions = []; // 조회하는 주소와 관련된 모든 트랜잭션을 취합하여 하나의 배열에 넣기 위함
    this.chain.forEach(block => { 
        block.transactions.forEach(transaction => {
            if (transaction.sender === address || transaction.recipient === address) {
                addressTransactions.push(transaction);
            }
        });
    });

    // 잔액 확인
    let balance = 0;
    addressTransactions.forEach(transaction => {
        if (transaction.recipient === address) balance += transaction.amount;
        else if (transaction.sender === address) balance -= transaction.amount;
    });
    return {
        addressTransactions: addressTransactions,
        addressBalance: balance
    }
};

// ★ addTransactionToPendingTransactions: 반환 된 newTransaction을 블록체인의 pendingTransactions 배열에 넣는 작업
Blockchain.prototype.addTransactionToPendingTransactions = function(transactionObj) {
	this.pendingTransactions.push(transactionObj);
	return this.getLastBlock()['index'] + 1;
};

module.exports = Blockchain;