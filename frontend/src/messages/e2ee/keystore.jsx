
import { openDB } from 'idb';

const DB_NAME = 'keystore-db';
const STORE_NAME = 'keystore';

export class KeyStore {
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

  async generateIdentityKey() {
    return window.crypto.subtle.generateKey(
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign', 'verify']
    );
  }

  async saveIdentityKey() {
    if (!this.identityKey) return;
    const db = await this.dbPromise;
    await db.put(STORE_NAME, this.identityKey, 'identityKey');
  }

  async getPublicKey() {
    if (!this.identityKey) throw new Error("Identity key not loaded");
    const publicKey = await window.crypto.subtle.exportKey('raw', this.identityKey.publicKey);
    return new Uint8Array(publicKey);
  }

  async getPrivateKey() {
    if (!this.identityKey) throw new Error("Identity key not loaded");
    return this.identityKey.privateKey;
  }

  async getPreKey(id) {
    const db = await this.dbPromise;
    let preKey = await db.get(STORE_NAME, `prekey-${id}`);
    if (!preKey) {
      preKey = await this.generatePreKey();
      await this.savePreKey(id, preKey);
    }
    return preKey;
  }

  async generatePreKey() {
    return window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );
  }

  async savePreKey(id, key) {
    const db = await this.dbPromise;
    await db.put(STORE_NAME, key, `prekey-${id}`);
  }

  async sign(data) {
    if (!this.identityKey) throw new Error("Identity key not loaded");
    return window.crypto.subtle.sign(
      { name: 'ECDSA', hash: { name: 'SHA-256' } },
      this.identityKey.privateKey,
      data
    );
  }

  async getSignedPublicPreKey(id) {
    const preKey = await this.getPreKey(id);
    const publicKey = await window.crypto.subtle.exportKey('raw', preKey.publicKey);
    const signature = await this.sign(publicKey);
    return { publicKey, signature };
  }
}
