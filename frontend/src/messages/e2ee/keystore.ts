
import { openDB } from 'idb';

const DB_NAME = 'keystore-db';
const STORE_NAME = 'keystore';
const KEY_PATH = 'key';

export class KeyStore {
  private dbPromise;
  public identityKey: CryptoKeyPair;

  constructor() {
    this.dbPromise = openDB(DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
    this.loadIdentityKey();
  }

  async loadIdentityKey() {
    const db = await this.dbPromise;
    this.identityKey = await db.get(STORE_NAME, 'identityKey');
    if (!this.identityKey) {
      this.identityKey = await this.generateIdentityKey();
      await this.saveIdentityKey();
    }
  }

  async generateIdentityKey(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
  }

  async saveIdentityKey() {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, this.identityKey, 'identityKey');
  }

  async getPublicKey(): Promise<Uint8Array> {
    const publicKey = await window.crypto.subtle.exportKey('raw', this.identityKey.publicKey);
    return new Uint8Array(publicKey);
  }

  async getPrivateKey(): Promise<CryptoKey> {
    return this.identityKey.privateKey;
  }

  async getPreKey(id: number): Promise<CryptoKeyPair> {
    const db = await this.dbPromise;
    let preKey = await db.get(STORE_NAME, `prekey-${id}`);
    if (!preKey) {
      preKey = await this.generatePreKey();
      await this.savePreKey(id, preKey);
    }
    return preKey;
  }

  async generatePreKey(): Promise<CryptoKeyPair> {
    return window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
  }

  async savePreKey(id: number, key: CryptoKeyPair) {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, key, `prekey-${id}`);
  }
}

