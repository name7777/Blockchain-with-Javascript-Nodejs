const Blockchain = require("../dev/blockchain");
const bitcoin = new Blockchain();

const bc1 = {
  chain: [
    {
      index: 1,
      timestamp: 1646574531242,
      transaction: [],
      nonce: 100,
      hash: "0",
      previousBlockHash: "0",
    },
    {
      index: 2,
      timestamp: 1646574568357,
      transaction: [],
      nonce: 18140,
      hash: "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
      previousBlockHash: "0",
    },
    {
      index: 3,
      timestamp: 1646574570486,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "3def9d509d5411ec969afb2c67d8b44e",
          transactionId: "3df876f09d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 65731,
      hash: "000014de0f3f07c2a5516bb1ad1ff302995f80ba3cc552463186e6067dff49db",
      previousBlockHash:
        "0000b9135b054d1131392c9eb9d03b0111d4b516824a03c35639e12858912100",
    },
    {
      index: 4,
      timestamp: 1646574571266,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "3f3479609d5411ec969afb2c67d8b44e",
          transactionId: "3f3515a09d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 38750,
      hash: "0000649baf9a3f1e65644cca5e5dbec2569a552b80fbc54ac138d4e1f58bb3b1",
      previousBlockHash:
        "000014de0f3f07c2a5516bb1ad1ff302995f80ba3cc552463186e6067dff49db",
    },
    {
      index: 5,
      timestamp: 1646574572342,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "3fab7e209d5411ec969afb2c67d8b44e",
          transactionId: "3fac68809d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 76197,
      hash: "00008568e1db3333e50e34d19a489a9fb8dde8c201757b2e73346d9e2d861221",
      previousBlockHash:
        "0000649baf9a3f1e65644cca5e5dbec2569a552b80fbc54ac138d4e1f58bb3b1",
    },
    {
      index: 6,
      timestamp: 1646574664494,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "404fad609d5411ec969afb2c67d8b44e",
          transactionId: "405049a09d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "72d9c1d09d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 289552,
      hash: "0000ed2731f85979c4b864e7544ffc2634bb0d037d5ce4a0e7f940c4c7cbccc9",
      previousBlockHash:
        "00008568e1db3333e50e34d19a489a9fb8dde8c201757b2e73346d9e2d861221",
    },
    {
      index: 7,
      timestamp: 1646574776806,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "773cf4e09d5411ec969afb2c67d8b44e",
          transactionId: "773e54709d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "b13d48c09d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "b199e7b09d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "b1ee97609d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "b244cdb09d5411ec969afb2c67d8b44e",
        },
        {
          amount: 2022,
          sender: "whkwon",
          recipient: "leejung",
          transactionId: "b29dea309d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 210570,
      hash: "0000c6a4cfadfad092eac7c5dcf28e6810604bfda4789808fe8822d813a3f91f",
      previousBlockHash:
        "0000ed2731f85979c4b864e7544ffc2634bb0d037d5ce4a0e7f940c4c7cbccc9",
    },
    {
      index: 8,
      timestamp: 1646574834098,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "ba2e68609d5411ec969afb2c67d8b44e",
          transactionId: "ba2f79d09d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 89047,
      hash: "00009261ac2c4b50a7f751f23418d82ed15ea6b030a0eeb16757689a9d1501ff",
      previousBlockHash:
        "0000c6a4cfadfad092eac7c5dcf28e6810604bfda4789808fe8822d813a3f91f",
    },
    {
      index: 9,
      timestamp: 1646574848073,
      transaction: [
        {
          amount: 12.5,
          sender: "00",
          recipient: "dc5479209d5411ec969afb2c67d8b44e",
          transactionId: "dc54ee509d5411ec969afb2c67d8b44e",
        },
      ],
      nonce: 60843,
      hash: "00006805a14744246f2934774661982bded41ab2a2e3406af04e65124a242301",
      previousBlockHash:
        "00009261ac2c4b50a7f751f23418d82ed15ea6b030a0eeb16757689a9d1501ff",
    },
  ],
  pendingTransactions: [
    {
      amount: 12.5,
      sender: "00",
      recipient: "e4a8e3909d5411ec969afb2c67d8b44e",
      transactionId: "e4a958c09d5411ec969afb2c67d8b44e",
    },
  ],
  currentNodeUrl: "http://localhost:3001",
  networkNodes: [],
};

console.log("VALID", bitcoin.chainIsValid(bc1.chain));
