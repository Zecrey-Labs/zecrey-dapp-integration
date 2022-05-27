# Zecrey Dapp Request Document

## 1. Connect wallet and get the account address

### EVM

```typescript
const { zecrey } = window; // global window in browser

if (zecrey) {
  const accounts: string[] = await zecrey.request({
    method: "eth_requestAccounts",
  });
  return accounts[0];
} else {
  alert("Please install Zecrey.");
}
```

### NEAR

```typescript
const { zecrey } = window; // global window in browser

if (zecrey) {
  const accounts: string[] = await zecrey.request({
    method: "near_requestAccounts",
  });
  return accounts[0];
} else {
  alert("Please install Zecrey.");
}
```

### Zecrey L2

```typescript
const { zecrey } = window; // global window in browser

if (zecrey) {
  const accounts: string[] = await zecrey.request({
    method: "zecrey_requestAccounts",
  });
  return accounts[0];
} else {
  alert("Please install Zecrey.");
}
```

## 2. Transfer native token on L1

### EVM

```typescript
const { zecrey } = window; // global window in browser

// Switch chain.
zecrey
  .request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x4" }],
  })
  .then(console.log);

// Check current chain ID
const chainId = await zecrey.send("eth_chainId");

const transactionParameters = {
  from: selectedAddress,
  to: "0x0000000000000000000000000000000000000000",
  value: "0x2540be400",
  gasPrice: "0x09184e72a000",
  gas: "0x2710",
  chainId: "0x4",
};

const txHash = await zecrey.request({
  method: "eth_sendTransaction",
  params: [transactionParameters],
});
```

### NEAR

```typescript
const { zecrey } = window; // global window in browser

const transactionParameters = {
  sender: nearAccountId,
  receiver: "example.testnet",
  action: "transfer",
  args: ["0x2540be400"],
};

const txHash = await zecrey.request({
  method: "near_sendTransaction",
  params: transactionParameters,
});
```

## 3. Call method of a smart contract on L1

### EVM

```typescript
const { zecrey } = window; // global window in browser

// Switch chain.
zecrey
  .request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: "0x4" }],
  })
  .then(console.log);

// Check current chain ID
const chainId = await zecrey.send("eth_chainId");

// Interact with an ERC20 contract to transfer some token.
const transactionParameters = {
  from: selectedAddress,
  to: contractAddress,
  value: "",
  data: "0x7f7465737432000000000000000000000000000000000000000000000000000000600057",
  gasPrice: "0x09184e72a000",
  gas: "0x2540be4",
  chainId: "0x4",
};

const txHash = await zecrey.request({
  method: "eth_sendTransaction",
  params: [transactionParameters],
});
```

### NEAR

```typescript
const { zecrey } = window; // global window in browser

// Interact with an FT contract to transfer some token.
const transactionParameters = {
  sender: nearAccountId,
  receiver: contract,
  action: "functionCall",
  args: [
    "ft_transfer",
    {
      receiver_id: "example.testnet",
      amount: "0x2540be400000000",
    },
    "300000000000000", // gas
    "1", // deposit
  ],
};

const txHash = await zecrey.request({
  method: "near_sendTransaction",
  params: transactionParameters,
});
```

## 4. Send Zecrey L2 transactions

```typescript
const { zecrey } = window; // global window in browser

const txHash = await zecrey.request({
  method: "zecrey_L2_sendTransaction",
  params: {
    action: 4, // transfer
    from: zecreyAccountName, // zecrey account name
    gasFeeAssetId: 0,
    args: {
      assetId: 0,
      payees: [{ address: "example.zecrey", amount: "10.0" }],
      memo: "",
    },
  },
});
```

## 5. Sign message

### EVM

```typescript
const { zecrey } = window; // global window in browser

const from = '0xD9ec5DAABd83dD452445f4bCA909aaeA335A9F38';
const message = 'hello world';
const signed = await zecrey.request({
  methode: 'eth_sign',
  params: [from, message],
  from
}) // 0x4734cbab803486d493073000edf7fa71e5778591f08eb02b8f7ae60ac1e1c64c725671ec88183c4d8db486255699265a7b77a3964571214608da0db716b52c7a1c
```
