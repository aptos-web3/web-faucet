// Copyright (c) The Aptos Foundation
// SPDX-License-Identifier: Apache-2.0

import * as SHA3 from 'js-sha3'
import fetch from 'cross-fetch'
import * as Nacl from 'tweetnacl'
import assert from 'assert'
import { Buffer } from 'buffer'

import { AccountResult } from '@/types/account'

// :!:>section_1
/** A subset of the fields of a TransactionRequest, for this tutorial */
export type TxnRequest = Record<string, any> & { sequence_number: string }

/** Represents an account as well as the private, public key-pair for the Aptos blockchain */
export class Account {
  signingKey: Nacl.SignKeyPair

  constructor (seed?: Uint8Array | undefined) {
    if (seed != null) {
      this.signingKey = Nacl.sign.keyPair.fromSeed(seed)
    } else {
      this.signingKey = Nacl.sign.keyPair()
    }
  }

  /** Returns the address associated with the given account */
  address (): string {
    return this.authKey()
  }

  /** Returns the authKey for the associated account */
  authKey (): string {
    const hash = SHA3.sha3_256.create()
    hash.update(Buffer.from(this.signingKey.publicKey))
    hash.update('\x00')
    return hash.hex()
  }

  /** Returns the public key for the associated account */
  publicKeyHex (): string {
    return Buffer.from(this.signingKey.publicKey).toString('hex')
  }

  /** Returns the public key for the associated account */
  privateKeyHex (): string {
    return Buffer.from(this.signingKey.secretKey).toString('hex').slice(0, 64)
  }
}

// <:!:section_1

// :!:>section_2
/** A wrapper around the Aptos-core Rest API */
export class RestClient {
  url: string

  constructor (url: string) {
    this.url = url
  }

  // <:!:section_2
  // :!:>section_3
  /** Returns the sequence number and authentication key for an account */
  async account (accountAddress: string): Promise<AccountResult> {
    const response = await fetch(`${this.url}/v1/accounts/${accountAddress}`, { method: 'GET' })
    if (response.status !== 200) {
      assert(response.status === 200, await response.text())
    }
    return await response.json()
  }

  /** Returns all resources associated with the account */
  async accountResources (accountAddress: string): Promise<Record<string, any> & { type: string }> {
    const response = await fetch(`${this.url}/v1/accounts/${accountAddress}/resources`, { method: 'GET' })
    if (response.status !== 200) {
      // assert(response.status === 200, await response.text())
    }
    // return await (await response.json() as Promise<Record<string, any> & { type: string }>)
    return await response.json()
  }

  // <:!:section_3

  // :!:>section_4
  /** Generates a transaction request that can be submitted to produce a raw transaction that
   can be signed, which upon being signed can be submitted to the blockchain. */
  async generateTransaction (sender: string, payload: Record<string, any>): Promise<TxnRequest> {
    const account = await this.account(sender)
    const seqNum = parseInt(account.sequence_number)
    return {
      sender: `0x${sender}`,
      sequence_number: seqNum.toString(),
      max_gas_amount: '1000',
      gas_unit_price: '1',
      gas_currency_code: 'XUS',
      // Unix timestamp, in seconds + 10 minutes
      expiration_timestamp_secs: (Math.floor(Date.now() / 1000) + 600).toString(),
      payload
    }
  }

  /** Converts a transaction request produced by `generate_transaction` into a properly signed
   transaction, which can then be submitted to the blockchain. */
  async signTransaction (accountFrom: Account, txnRequest: TxnRequest): Promise<TxnRequest> {
    const response = await fetch(`${this.url}/v1/transactions/signing_message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txnRequest)
    })
    if (response.status !== 200) {
      const responseText: string = await response.text()
      assert(response.status === 200, responseText + JSON.stringify(txnRequest))
    }
    const result: Record<string, any> & { message: string } = await response.json()
    const toSign = Buffer.from(result.message.substring(2), 'hex')
    const signature = Nacl.sign(toSign, accountFrom.signingKey.secretKey)
    const signatureHex: string = Buffer.from(signature).toString('hex').slice(0, 128)
    txnRequest.signature = {
      type: 'ed25519_signature',
      public_key: `0x${accountFrom.publicKeyHex()}`,
      signature: `0x${signatureHex}`
    }
    return txnRequest
  }

  /** Submits a signed transaction to the blockchain. */
  async submitTransaction (accountFrom: Account, txnRequest: TxnRequest): Promise<Record<string, any>> {
    const response = await fetch(`${this.url}/v1/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(txnRequest)
    })
    if (response.status !== 202) {
      const responseText: string = await response.text()
      assert(response.status === 202, responseText + ' - ' + JSON.stringify(txnRequest))
    }
    return await response.json()
  }

  async transactionPending (txnHash: string): Promise<boolean> {
    const response = await fetch(`${this.url}/v1/transactions/by_hash/${txnHash}`, { method: 'GET' })
    if (response.status === 404) {
      return true
    }
    if (response.status !== 200) {
      assert(response.status === 200, await response.text())
    }
    return (await response.json()).type === 'pending_transaction'
  }

  /** Waits up to 10 seconds for a transaction to move past pending state */
  async waitForTransaction (txnHash: string) {
    let count = 0
    while (await this.transactionPending(txnHash)) {
      assert(count < 10)
      await new Promise(resolve => setTimeout(resolve, 1000))
      count += 1
      if (count >= 10) {
        throw new Error(`Waiting for transaction ${txnHash} timed out!`)
      }
    }
  }

  // <:!:section_4
  // :!:>section_5
  /** Returns the test coin balance associated with the account */
  async accountBalance (accountAddress: string): Promise<number | null> {
    const resources = await this.accountResources(accountAddress)
    for (const key in resources) {
      const resource = resources[key]

      if (resource.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>') {
        return parseInt(resource.data.coin.value)
      }
    }
    return null
  }

  /** Transfer a given coin amount from a given Account to the recipient's account address.
   Returns the sequence number of the transaction used to transfer. */
  async transfer (accountFrom: Account, recipient: string, amount: number): Promise<string> {
    const payload: { function: string, arguments: string[], type: string, type_arguments: any[] } = {
      type: 'script_function_payload',
      function: '0x1::TestCoin::transfer',
      type_arguments: [],
      arguments: [
        `0x${recipient}`,
        amount.toString()
      ]
    }
    const txnRequest = await this.generateTransaction(accountFrom.address(), payload)
    const signedTxn = await this.signTransaction(accountFrom, txnRequest)
    const res = await this.submitTransaction(accountFrom, signedTxn)
    return res.hash.toString()
  }
}

// <:!:section_5
// :!:>section_6
/** Faucet creates and funds accounts. This is a thin wrapper around that. */
export class FaucetClient {
  url: string
  restClient: RestClient

  constructor (url: string, restClient: RestClient) {
    this.url = url
    this.restClient = restClient
  }

  /** This creates an account if it does not exist and mints the specified amount of
   coins into that account */
  async fundAccount (address: string, amount: number) {
    const url = `${this.url}/mint?amount=${amount}&address=${address}`
    const response = await fetch(url, { method: 'POST' })
    if (response.status !== 200) {
      assert(response.status === 200, await response.text())
    }
    /** wait for transaction might be failed */
    const tnxHashes = await response.json() as string[]
    for (const tnxHash of tnxHashes) {
      await this.restClient.waitForTransaction(tnxHash)
    }
  }
}
