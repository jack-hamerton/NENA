
import { generateIdentity, generatePreKey, signPublicKey } from './crypto';

export class KeyStore {
  private identityKey: CryptoKeyPair | null = null;
  private preKeys: CryptoKeyPair[] = [];

  constructor(private userId: string) {}

  async initialize() {
    this.identityKey = await generateIdentity();
    // Generate a batch of pre-keys
    for (let i = 0; i < 10; i++) {
      this.preKeys.push(await generatePreKey());
    }
  }

  get publicIdentityKey(): CryptoKey | null {
    return this.identityKey ? this.identityKey.publicKey : null;
  }

  get publicPreKeys(): { keyId: number, publicKey: CryptoKey }[] {
    return this.preKeys.map((keyPair, i) => ({ keyId: i, publicKey: keyPair.publicKey }));
  }

  async getSignedPublicPreKey(keyId: number): Promise<{ publicKey: CryptoKey, signature: ArrayBuffer } | null> {
    if (!this.identityKey || !this.preKeys[keyId]) {
      return null;
    }
    const publicKey = this.preKeys[keyId].publicKey;
    const signature = await signPublicKey(this.identityKey.privateKey, publicKey);
    return { publicKey, signature };
  }

  // In a real application, this would be more sophisticated
  // and would involve storing and retrieving keys from a secure storage.
}
