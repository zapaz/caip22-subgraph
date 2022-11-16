import { BigInt, store } from '@graphprotocol/graph-ts';
import { Transfer, ERC721 } from '../generated/ERC721/ERC721';
import { Token } from '../generated/schema';

const ZERO_ADDRESS_STRING = '0x0000000000000000000000000000000000000000';
const CHAIN_ID = 5;

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

function eventId(event: Transfer): string {
  return `eip155:${CHAIN_ID}/erc721:${event.address.toHex()}/${event.params.tokenId.toString()}`;
}

function mintEvent(event: Transfer): void {
  let eip721Token = new Token(eventId(event));

  eip721Token.address = event.address.toHex();
  eip721Token.owner = event.params.to.toHex();

  let metadataURItried = ERC721.bind(event.address).try_tokenURI(event.params.tokenId);
  eip721Token.tokenURI = metadataURItried.reverted ? "" : normalize(metadataURItried.value);

  eip721Token.save();
}

function transferEvent(event: Transfer): void {
  let eip721Token = Token.load(eventId(event));

  if (eip721Token) {
    let metadataURIprevious = eip721Token.tokenURI;

    let metadataURItried = ERC721.bind(event.address).try_tokenURI(event.params.tokenId);
    if (!metadataURItried.reverted) {
      let metadataURInew = normalize(metadataURItried.value);

      if (metadataURInew != metadataURIprevious) {
        eip721Token.tokenURI = metadataURInew;
      }
    }
    eip721Token.owner = event.params.to.toHex();
    eip721Token.save();
  }
}

function burnEvent(event: Transfer): void {
  store.remove('Token', eventId(event));
}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from.toHex();
  let to = event.params.to.toHex();

  if (from == ZERO_ADDRESS_STRING) {
    if (to == ZERO_ADDRESS_STRING) return;
    else mintEvent(event);
  } else {
    if (to == ZERO_ADDRESS_STRING) burnEvent(event);
    else transferEvent(event);
  }
}
