
import { KeyStore } from './keystore';
import { encryptSessionKeyForAuditor } from './auditorCrypto.js';

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
    this.auditorEncryptedKey = null; // To store the key encrypted for the auditor
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
    
    // Export the shared secret and encrypt it for the auditor
    if (session.sharedSecret) {
        const exportedKey = await window.crypto.subtle.exportKey('raw', session.sharedSecret);
        const keyHex = ab2hex(exportedKey);
        session.auditorEncryptedKey = await encryptSessionKeyForAuditor(keyHex);
    }

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
      ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey'] // Added export permissions
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
      auditData: session.auditorEncryptedKey, // Include the auditor-encrypted key
    };
  }

  async decryptMessage(sessionId, iv, ciphertext) {
    const session = this.sessions.get(sessionId);
    if (!session || !session.sharedSecret) {
        // The session might not exist on this client. Throw an error so the caller can handle the fallback.
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
      // Re-throw the error so the UI layer can decide to trigger a fallback.
      throw new Error('Failed to decrypt message.');
    }
  }

  /**
   * Logs the payload that would be sent to the server for auditing in a fallback scenario.
   * @param {object} messagePayload The full message object containing iv, ciphertext, and auditData.
   */
  fallbackToServer(messagePayload) {
    // In a real application, you would send this entire object to your server.
    // The server would require authentication to store and later retrieve the message.
    console.log('FALLBACK TRIGGERED: The following payload would be sent to the server for auditing:', messagePayload);
    
    // Example of what you would do on the server side:
    // await fetch('/api/audit/store-message', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${authToken}` },
    //   body: JSON.stringify(messagePayload)
    // });
  }

  generateSessionId(recipientId) {
    return `session-${Date.now()}-${recipientId}`;
  }
}
