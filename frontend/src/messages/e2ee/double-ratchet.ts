
import { KeyStore } from './keystore';
import { deriveSharedSecret, encryptMessage, decryptMessage, verifySignature } from './crypto';

// This is a simplified implementation of the Double Ratchet algorithm.
// A real implementation would be more complex and would involve a state machine.

export class DoubleRatchet {
  private rootKey: CryptoKey | null = null;
  private sendingKey: CryptoKey | null = null;
  private receivingKey: CryptoKey | null = null;
  private previousReceivingKey: CryptoKey | null = null;

  constructor(private keyStore: KeyStore, private otherUserPublicKey: CryptoKey) {}

  async initialize() {
    // In a real implementation, we would use the X3DH protocol to establish the initial shared secret.
    // Here, we'll just derive it directly from the other user's public key.
    const sharedSecret = await deriveSharedSecret(this.keyStore.identityKey.privateKey, this.otherUserPublicKey);
    this.rootKey = sharedSecret;
    this.sendingKey = sharedSecret;
    this.receivingKey = sharedSecret;
  }

  async encrypt(message: string): Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }> {
    if (!this.sendingKey) {
      throw new Error('Double Ratchet not initialized');
    }
    const { ciphertext, iv } = await encryptMessage(this.sendingKey, message);
    // In a real implementation, we would update the sending key after each message.
    return { ciphertext, iv };
  }

  async decrypt(ciphertext: ArrayBuffer, iv: Uint8Array): Promise<string> {
    if (!this.receivingKey) {
      throw new Error('Double Ratchet not initialized');
    }
    try {
      return await decryptMessage(this.receivingKey, ciphertext, iv);
    } catch (error) {
      // If decryption fails, try the previous receiving key (out-of-order message)
      if (this.previousReceivingKey) {
        return await decryptMessage(this.previousReceivingKey, ciphertext, iv);
      } else {
        throw error;
      }
    }
  }
}
