# NFT CAIP22 subgraph

NFT ERC721 subgraph with CAIP22 identifier

- id : NFT identifier conformant to CAIP22
- chainId : blockchain identifier
- address : address of the NFT smartcontract
- tokenID : NFT identifier inside smartcontract
- tokenURI : uri containing json NFT metadata
- owner : last owner of this NFT

https://github.com/ChainAgnostic/CAIPs/blob/master/CAIPs/caip-22.md

Available on Goerli testnet

Playground here :
https://api.studio.thegraph.com/query/457/caip22/v0.0.9

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
