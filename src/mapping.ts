import { BigInt, store } from '@graphprotocol/graph-ts';
import { Transfer, ERC721 } from '../generated/ERC721/ERC721';
import { Token } from '../generated/schema';

let ZERO_ADDRESS_STRING = '0x0000000000000000000000000000000000000000';

function setCharAt(str: string, index: i32, char: string): string {
  if (index > str.length - 1) return str;
  return str.substr(0, index) + char + str.substr(index + 1);
}

function normalize(strValue: string): string {
  if (strValue.length === 1 && strValue.charCodeAt(0) === 0) {
    return "";
  } else {
    for (let i = 0; i < strValue.length; i++) {
      if (strValue.charCodeAt(i) === 0) {
        strValue = setCharAt(strValue, i, '\ufffd'); // graph-node db does not support string with '\u0000'
      }
    }
    return strValue;
  }
}

export function handleTransfer(event: Transfer): void {
  const chainId = 5;
  let tokenId = event.params.tokenId;

  let id = `eip155:${chainId}/erc721:${event.address.toHex()}/${tokenId.toString()}`;

  let from = event.params.from.toHex();
  let to = event.params.to.toHex();
  let contract = ERC721.bind(event.address);

  if ((from == ZERO_ADDRESS_STRING) && (to == ZERO_ADDRESS_STRING)) return;

  if (from == ZERO_ADDRESS_STRING) {  // MINT 
    let eip721Token = new Token(id);

    let metadataURItried = contract.try_tokenURI(tokenId);
    if (!metadataURItried.reverted) {
      eip721Token.tokenURI = normalize(metadataURItried.value);
    }

    eip721Token.save();
  } else {
    if (to == ZERO_ADDRESS_STRING) {  // BURN
      store.remove('Token', id);
    } else {                          // TRANSFER
      let eip721Token = Token.load(id);

      if (eip721Token) {
        let metadataURIprevious = eip721Token.tokenURI;
        let metadataURItried = contract.try_tokenURI(tokenId);

        if (!metadataURItried.reverted) {
          let metadataURInew = normalize(metadataURItried.value);

          if (metadataURInew != metadataURIprevious) {
            eip721Token.tokenURI = metadataURInew;
            eip721Token.save();
          }
        }
      }
    }
  }

}
