import { BigInt } from "@graphprotocol/graph-ts"
import {
  OpenNFTs,
  Approval,
  ApprovalForAll,
  OwnershipTransferred,
  Pay,
  SetDefaultRoyalty,
  SetMintPrice,
  SetPaused,
  SetTokenPrice,
  SetTokenRoyalty,
  Transfer
} from "../generated/OpenNFTs/OpenNFTs"
import { ExampleEntity } from "../generated/schema"

export function handleApproval(event: Approval): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.owner = event.params.owner
  entity.approved = event.params.approved

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.balanceOf(...)
  // - contract.getApproved(...)
  // - contract.getDefaultRoyalty(...)
  // - contract.getMintPrice(...)
  // - contract.getTokenPrice(...)
  // - contract.getTokenRoyalty(...)
  // - contract.initialized(...)
  // - contract.isApprovedForAll(...)
  // - contract.minimal(...)
  // - contract.mint(...)
  // - contract.mint(...)
  // - contract.name(...)
  // - contract.open(...)
  // - contract.owner(...)
  // - contract.ownerOf(...)
  // - contract.parent(...)
  // - contract.paused(...)
  // - contract.royaltyInfo(...)
  // - contract.supportsInterface(...)
  // - contract.symbol(...)
  // - contract.template(...)
  // - contract.tokenByIndex(...)
  // - contract.tokenIdNext(...)
  // - contract.tokenOfOwnerByIndex(...)
  // - contract.tokenURI(...)
  // - contract.totalSupply(...)
  // - contract.version(...)
}

export function handleApprovalForAll(event: ApprovalForAll): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handlePay(event: Pay): void {}

export function handleSetDefaultRoyalty(event: SetDefaultRoyalty): void {}

export function handleSetMintPrice(event: SetMintPrice): void {}

export function handleSetPaused(event: SetPaused): void {}

export function handleSetTokenPrice(event: SetTokenPrice): void {}

export function handleSetTokenRoyalty(event: SetTokenRoyalty): void {}

export function handleTransfer(event: Transfer): void {}
