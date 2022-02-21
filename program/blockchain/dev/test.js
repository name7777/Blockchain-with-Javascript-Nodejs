// blockchain.js에서 만든 프로그램을 test하기 위한 공간
const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
bitcoin.createNewBlock(789457, 'OIUOEDJETH8754DHKD', '78SHNEG45DER56'); // 1. 최초의 블록 하나를 생성
bitcoin.createNewTransaction(100, 'ALEXHT845SJ5TKCJ2', 'JENN5BG5DF6HT8NG9'); // 2. 최초의 트랜잭션 하나를 생성 -> 100만큼 금액을 ALEX와 JEN이라는 사람끼리 거래하는 트랜잭션 (교육용이기에 앞에 이름을 넣은 것 뿐, 실제로 X)

bitcoin.createNewBlock(548764, 'AKMC875E6S1RS9', 'WPLS214R7T6SJ3G2'); // 3. 새로운 블록을 생성(채굴) -> 이 블록에 위에 생성한 미결 트랜잭션이 드디어 새로운 블록에 추가 됨 

bitcoin.createNewTransaction(200, 'WONHT845SJ5TKCJ2', 'JUNGN5BG5DF6HT8NG9'); // 4. 연달아 3개의 트랜잭션을 생성. (아직 chain에 포함되지 않은 미결(pendding) 트랜잭션들)
bitcoin.createNewTransaction(300, 'LEEXHT845SJ5TKCJ2', 'KWON5BG5DF6HT8NG9');
bitcoin.createNewTransaction(400, 'HYUNHT845SJ5TKCJ2', 'NOZEN5BG5DF6HT8NG9');

bitcoin.createNewBlock(248573, 'QWOEIRUKLMFXCFKJ', '34LK5JKL2J5KLJ5'); // 5. 새로운 블록을 생성(채굴) -> 위에 4번에서 만든 3개의 미결 트랜잭션들이 이 블록에 다 담긴다

console.log(bitcoin);
