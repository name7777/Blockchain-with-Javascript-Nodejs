// 블록체인의 모든 데이터 구조는 여기서 전부 개발한다
const sha256 = require('sha256');

// 생성자 함수 (JS에선 class보다 생성자함수 사용을 더 선호하기에 class 대신 사용)
function Blockchain() {
    this.chain = []; // 블록체인의 핵심이 저장되는 곳
    this.penddingTransactions = []; // 블록에 아직 저장되지 않은 모든 트랜잭션들을 저장해두는 곳
    this.createNewBlock(100, '0', '0'); // ★ 최초의 블록인 Genesis Block을 만들기 위해 값을 임의로 넣음
};

// ★ createNewBlock: 새로운 블록을 생성하는 메소드
Blockchain.prototype.createNewBlock = function (nonce, previousBlockHash, hash) {
    const newBlock = { // ★newBlock: Blockchain 안의 새로운 블록. 모든 관련 데이터들은 이 블록 안에 저장
        index : this.chain.length + 1, // index: newBlock의 번호(index)를 매기기 위함
        timestamp : Date.now(), // timestamp: 블록이 생성 된 시점
        transaction : this.penddingTransactions, // transaction: 새로운 블록을 만들었을 때 모든 새로운 트랜잭션들과 미결 트랜잭션들을 새로운 블록에 추가하고, 이를 통해 이 트랜잭션들은 블록체인 내에 보관되어 영원히 변경되지 않게 됨
        nonce : nonce, // nonce: function 인자의 nonce와 같은 값. nonce는 작업 증명(Proof of Work) 메소드를 통해 적법하게 새로운 블록을 만들었다는 증거
        hash : hash, // hash: newBlock 객체에서 온 값. penddingTransactions를 해싱 함수에 매개변수로 전달 -> 트랜잭션들은 하나의 문자열로 압축되며 이것이 hash값이 됨 ('현재' 블록의 해시값)
        previousBlockHash : previousBlockHash, // previousBlockHash: hash 속성과 매우 유사. 다만, hash는 현재 블록의 데이터를 해싱한 값이라면 previousBlockHash는 이전 블록에서 현재 블록까지의 데이터를 해싱한 값('과거부터 현재' 블록의 해시값)
    };
    this.penddingTransactions = []; // 초기화 -> 새로운 블록을 만들 때 모든 새로운 트랜잭션들을 해당 블록에 추가하기 때문임. 그러므로 새로운 트랜잭션들의 배열을 초기화하고 그 후에 새로운 다음 블록 생성을 시작할 수 있음
    this.chain.push(newBlock); // 새로운 블록을 체인에 추가
    return newBlock; // 제일 마지막 블록을 채굴하면 다시 초기화하여 새로운 블록을 맞을 준비를 함
};

// ★ getLastBlock: 가장 마지막 블록을 반환해주는 메소드
Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};

// ★ createNewTransaction: 새로운 트랜잭션을 생성하는 메소드
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) { // amount: 트랜잭션을 통해 송금하는 양, sender: 발송인의 주소, recipient: 수신자의 주소
    const newTransaction = {
        amount : amount,
        sender : sender,
        recipient : recipient,
    }
    this.penddingTransactions.push(newTransaction);
    return this.getLastBlock() ['index'] + 1
};

// ★ hashBlock: 블록을 입력받아 이 블록의 데이터를 고정된 길이의 문자열로 해싱하는 일을 수행
Blockchain.prototype.hashBlock = function(previousBlockHash, currentBlockdata, nonce) { // 함수 내 인자: 값을 생성하고자 하는 블록의 데이터. 즉 메소드 내에서 해싱할 데이터들(하나의 블록으로 부터 3가지 인자가 모두 온다)
    const dataAsString = previousBlockHash + nonce.toString() + JSON.stringify(currentBlockdata); // nonce는 숫자이기에 문자열로 변경, currentBlockdata는 하나의 객체(트랜잭션)지만 json.stringify로 문자열로 변경
    const hash = sha256(dataAsString); // 이를 통해 모든 블록 데이터(3개의 인자)로부터 해싱 값을 만듦
    return hash;
};

// ★ proofOfWork(작업증명, POW): 
Blockchain.prototype.proofOfWork = function(previousBlockHash, currentBlockdata) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currentBlockdata, nonce);
    while (hash.substring(0, 4) !== '0000') { // 우리는 해시값 앞에 0000으로 시작하는 값만 추출하길 조건을 걸었다. 0000으로 시작하는 hash값을 찾기 위해 while문을 돌린다
        nonce++;
        hash = this.hashBlock(previousBlockHash, currentBlockdata, nonce);
    };
    return nonce;
};

module.exports = Blockchain;