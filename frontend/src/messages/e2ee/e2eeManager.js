
import { KeyStore } from './keystore';

// Helper to convert ArrayBuffer to a Hex string
function ab2hex(ab) {
  return Array.from(new Uint8Array(ab)).map(b => b.toString(16).padStart(2, '0')).join('');
}

class Session {
  constructor(sessionId, recipientIdentityKey, recipientPreKey) {
    this.sessionId = sessionId;
    this.recipientIdentityKey = recipientIdentityKey;
    this.recipientPreKey = recipientPreKey;
    this.sharedSecret = null;
  }
}

export class E2EEManager {
  constructor(keyStore) {
    this.keyStore = keyStore;
    this.sessions = new Map();
  }

  async establishSession(recipientId, recipientIdentityKey, recipientPreKey) {
    const sessionId = this.generateSessionId(recipientId);
    const session = new Session(sessionId, recipientIdentityKey, recipientPreKey);
    
    // Derive the shared secret for user-to-user encryption
    await this.deriveSharedSecret(session);

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  async deriveSharedSecret(session) {
    const privateKey = await this.keyStore.getPrivateKey();
    const sharedSecret = await window.crypto.subtle.deriveKey(
      {
        name: 'ECDH',
        public: session.recipientPreKey,
      },
      privateKey,
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt']
    );
    session.sharedSecret = sharedSecret;
  }

  async encryptMessage(sessionId, plaintext) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.sharedSecret) {
      throw new Error('Session not established or shared secret not derived.');
    }

    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encrypted = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
      },
      session.sharedSecret,
      new TextEncoder().encode(plaintext)
    );

    return {
      iv: Array.from(iv),
      ciphertext: Array.from(new Uint8Array(encrypted)),
    };
  }

  async decryptMessage(sessionId, iv, ciphertext) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.sharedSecret) {
        throw new Error('E2EE session not found for decryption.');
    }

    try {
      const decrypted = await window.crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(iv),
        },
        session.sharedSecret,
        new Uint8Array(ciphertext)
      );
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      throw new Error('Failed to decrypt message.');
    }
  }

  generateSessionId(recipientId) {
    return `session-${Date.now()}-${recipientId}`;
  }
}
