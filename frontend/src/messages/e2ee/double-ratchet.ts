import { generateKeyPair, sign, deriveSharedSecret, encryptMessage, decryptMessage, verifySignature } from './crypto';
import { KeyStore } from './keystore';

const MAX_MESSAGE_CHAIN_LENGTH = 100;

export class DoubleRatchet {
  private keyStore: KeyStore;
  private theirPublicKey: CryptoKey;
  private rootKey: CryptoKey;
  private sendingChainKey: CryptoKey;
  private receivingChainKey: CryptoKey;
  public messageNumber = 0;
  public previousMessageNumber = 0;

  constructor(keyStore: KeyStore, theirPublicKey: CryptoKey, sharedSecret: CryptoKey) {
    this.keyStore = keyStore;
    this.theirPublicKey = theirPublicKey;
    this.rootKey = sharedSecret;
  }

  async initialize() {
    const [sendingChainKey, receivingChainKey] = await this.kdf(this.rootKey, new Uint8Array(0));
    this.sendingChainKey = sendingChainKey;
    this.receivingChainKey = receivingChainKey;
  }

  async encrypt(plaintext: BufferSource): Promise<Uint8Array> {
    const [messageKey, nextSendingChainKey] = await this.kdf(this.sendingChainKey, new Uint8Array([1]));
    this.sendingChainKey = nextSendingChainKey;

    const ciphertext = await encryptMessage(messageKey, plaintext);

    const ourPublicRatchetKey = new Uint8Array(await this.keyStore.getPublicKey());
    
    // --- SECURITY PATCH: Sign both the public key and the ciphertext ---
    const dataToSign = new Uint8Array(ourPublicRatchetKey.byteLength + ciphertext.byteLength);
    dataToSign.set(ourPublicRatchetKey, 0);
    dataToSign.set(new Uint8Array(ciphertext), ourPublicRatchetKey.byteLength);
    const signature = new Uint8Array(await sign(await this.keyStore.getPrivateKey(), dataToSign));
    // --- END PATCH ---

    const message = new Uint8Array(ourPublicRatchetKey.byteLength + signature.byteLength + ciphertext.byteLength);
    message.set(ourPublicRatchetKey, 0);
    message.set(signature, ourPublicRatchetKey.byteLength);
    message.set(new Uint8Array(ciphertext), ourPublicRatchetKey.byteLength + signature.byteLength);

    this.messageNumber++;

    return message;
  }

  async decrypt(message: BufferSource): Promise<Uint8Array> {
    const messageUint8 = new Uint8Array(message as ArrayBuffer);
    const theirPublicRatchetKeyBytes = messageUint8.slice(0, 65);
    const signature = messageUint8.slice(65, 129);
    const ciphertext = messageUint8.slice(129);

    // --- SECURITY PATCH: Verify the signature against the public key and the ciphertext ---
    const dataToVerify = new Uint8Array(theirPublicRatchetKeyBytes.byteLength + ciphertext.byteLength);
    dataToVerify.set(theirPublicRatchetKeyBytes, 0);
    dataToVerify.set(ciphertext, theirPublicRatchetKeyBytes.byteLength);
    const verified = await verifySignature(this.theirPublicKey, signature, dataToVerify);
    // --- END PATCH ---

    if (!verified) {
      throw new Error('Invalid signature');
    }

    const theirPublicRatchetKey = await window.crypto.subtle.importKey('raw', theirPublicRatchetKeyBytes, { name: 'ECDH', namedCurve: 'P-256' }, true, []);
    if (await this.isNewRatchet(theirPublicRatchetKey)) {
      await this.ratchet(theirPublicRatchetKey);
    }

    let messageKey;
    let i = 0;
    while (i < MAX_MESSAGE_CHAIN_LENGTH) {
      try {
        [messageKey, this.receivingChainKey] = await this.kdf(this.receivingChainKey, new Uint8Array([1]));
        const plaintext = await decryptMessage(messageKey, ciphertext);
        this.previousMessageNumber = i;
        return plaintext;
      } catch (error) {
        i++;
      }
    }
    throw new Error('Could not decrypt message');
  }

  private async kdf(key: CryptoKey, input: BufferSource): Promise<[CryptoKey, CryptoKey]> {
    const derivedBits = await window.crypto.subtle.deriveBits(
      { name: 'HKDF', hash: 'SHA-256', salt: new Uint8Array(), info: input },
      key,
      512
    );
    const key1 = await window.crypto.subtle.importKey('raw', derivedBits.slice(0, 32), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
    const key2 = await window.crypto.subtle.importKey('raw', derivedBits.slice(32, 64), { name: 'AES-GCM' }, true, ['encrypt', 'decrypt']);
    return [key1, key2];
  }

  private async isNewRatchet(theirPublicKey: CryptoKey): Promise<boolean> {
    const theirPublicKeyRaw = await window.crypto.subtle.exportKey('raw', theirPublicKey);
    const currentPublicKeyRaw = await window.crypto.subtle.exportKey('raw', this.theirPublicKey);
    return new TextDecoder().decode(theirPublicKeyRaw) !== new TextDecoder().decode(currentPublicKeyRaw);
  }

  private async ratchet(theirPublicKey: CryptoKey) {
    const newRootKey = await deriveSharedSecret(await this.keyStore.getPrivateKey(), theirPublicKey);
    const [newSendingChainKey, newReceivingChainKey] = await this.kdf(newRootKey, new Uint8Array(0));
    this.rootKey = newRootKey;
    this.sendingChainKey = newSendingChainKey;
    this.receivingChainKey = newReceivingChainKey;
    this.theirPublicKey = theirPublicKey;
  }
}
