const Blockchain = require("../dev/blockchain");
const bitcoin = new Blockchain();


// 여기서 각 블럭끼리 맞는 hash를 조작해도 false라는 결과가 나온다. 물론 당연하지만, 어느 로직에서 걸려서 false가 나오는 걸까??
const bc1 = {
  "chain": [
  {
  "index": 1,
  "timestamp": 1646745665485,
  "transactions": [],
  "nonce": 100,
  "hash": "0",
  "previousBlockHash": "0"
  },
  {
  "index": 2,
  "timestamp": 1646745670837,
  "transactions": [],
  "nonce": 18140,
  "hash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
  "previousBlockHash": "0"
  },
  {
  "index": 3,
  "timestamp": 1646745673314,
  "transactions": [
  {
  "amount": 12.5,
  "sender": "00",
  "recipient": "9ef61e509ee211ec81a701dbcb2d97af",
  "transactionId": "9eff46109ee211ec81a701dbcb2d97af"
  }
  ],
  "nonce": 28908,
  "hash": "0000fbe7454f31176480bd0f36e33a78146f7c42c0013f49b64ae00364ece274",
  "previousBlockHash": "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100"
  },
  {
  "index": 4,
  "timestamp": 1646745677752,
  "transactions": [
  {
  "amount": 12.5,
  "sender": "00",
  "recipient": "a07014209ee211ec81a701dbcb2d97af",
  "transactionId": "a07125909ee211ec81a701dbcb2d97af"
  },
  {
  "amount": 2022,
  "sender": "whkwon",
  "recipient": "leejung",
  "transactionId": "a1c78dd09ee211ec81a701dbcb2d97af"
  },
  {
  "amount": 2022,
  "sender": "whkwon",
  "recipient": "leejung",
  "transactionId": "a22a95609ee211ec81a701dbcb2d97af"
  }
  ],
  "nonce": 16728,
  "hash": "0000643b1962f171b34f1542c50c00b3965cf3d032c5d6790b96af1ba3e9e7ad",
  "previousBlockHash": "0000fbe7454f31176480bd0f36e33a78146f7c42c0013f49b64ae00364ece274"
  }
  ],
  "pendingTransactions": [
  {
  "amount": 12.5,
  "sender": "00",
  "recipient": "a31543809ee211ec81a701dbcb2d97af",
  "transactionId": "a315b8b09ee211ec81a701dbcb2d97af"
  }
  ],
  "currentNodeUrl": "http://localhost:3001",
  "networkNodes": []
  }
  
  
console.log('VALID: ', bitcoin.chainIsValid(bc1.chain));

