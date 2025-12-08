
import { KeyStore } from './keystore';
import { DoubleRatchet } from './double-ratchet';
import { verifySignature } from './crypto';

// This is a simplified implementation of the X3DH protocol.

export class X3DH {
  constructor(private keyStore: KeyStore) {}

  async establishSharedSecret(otherUserPublicIdentityKey: CryptoKey, otherUserSignedPublicPreKey: { publicKey: CryptoKey, signature: ArrayBuffer }): Promise<DoubleRatchet> {
    // 1. Verify the signature of the other user's pre-key
    const signatureIsValid = await verifySignature(otherUserPublicIdentityKey, otherUserSignedPublicPreKey.signature, otherUserSignedPublicPreKey.publicKey);
    if (!signatureIsValid) {
      throw new Error('Invalid signature for the other user\'s pre-key');
    }

    // 2. Create a new DoubleRatchet instance
    const doubleRatchet = new DoubleRatchet(this.keyStore, otherUserSignedPublicPreKey.publicKey);
    await doubleRatchet.initialize();

    return doubleRatchet;
  }
}
