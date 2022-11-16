# NFT CAIP22 subgraph

NFT ERC721 subgraph with two fields only :

- id as CAIP22 NFT ref
- tokenURI

Available on Goerli testnet

Playground here :
https://api.studio.thegraph.com/query/457/caip22/v0.0.6

example query :

```
{
  tokens(first: 1) {
    id
    tokenURI
  }
}
```

example result :

```
{
  "data": {
    "tokens": [
      {
        "id": "eip155:5/erc721:0x036b4ed70b6c56014c6f4f112042d911c33d5695/113928919",
        "tokenURI": "https://ipfs.infura.io/ipfs/QmaxTFHTbLmj26EQcYutT6Uw5fKNtSroCHQao6WU3XiPmk"
      }
    ]
  }
}
```
