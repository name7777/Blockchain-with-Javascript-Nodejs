// hashBlock 테스트
const Blockchain = require('../dev/blockchain');

const bitcoin = new Blockchain();

// 앞서 만든 hashBlock 메소드 내 3개 인자들의 더미데잍터를 만듦
const previousBlockHash = "87765DA6CCF0668238C1D27C35682E11"; // 일단 임의의 문자열 값으로 사용
const currentBlockdata = [
  {
    amount: 10,
    sender: "B4CEE9C0E5CD571",
    recipient: "3A3F6E462D48E9",
  },
  {
    amount: 200,
    sender: "K2J32JLJK2J5KL2",
    recipient: "2K3JKLJ2LJJJL1",
  },
  {
    amount: 50,
    sender: "23G4GJHGG2GH2G1",
    recipient: "L32YUC2CK1NN51",
  },
];
const nonce = 100;

// console.log(bitcoin.proofOfWork(previousBlockHash, currentBlockdata)); // 0000으로 시작하는 해시값을 찾기 위한 proofOfWork 메소드 -> 해당하는 nonce값을 뱉음
console.log(bitcoin.hashBlock(previousBlockHash, currentBlockdata, 99577)); // 0000으로 시작하는 해시값을 찾기 위한 proofOfWork 메소드 -> 해당하는 nonce값을 뱉음
