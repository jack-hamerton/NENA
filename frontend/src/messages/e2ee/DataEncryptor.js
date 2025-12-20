
import { KeyStore } from './keystore';
import { PRE_KEY_ID, IDENTITY_KEY_ID } from './e2eeManager';

// A simplified manager for encrypting/decrypting data for the server (not user-to-user).
// This ensures the server stores zero-knowledge data, but the owner can audit.
export class DataEncryptor {
  constructor(keyStore) {
    if (!keyStore) {
      throw new Error("DataEncryptor requires a valid KeyStore.");
    }
    this.keyStore = keyStore;
  }

  /**
   * Encrypts a JSON payload for zero-knowledge storage on a server.
   * The data is encrypted with a new, random session key.
   * That session key is then encrypted for the App Owner (auditor).
   * @param {object} jsonData The data to encrypt.
   * @returns {Promise<string>} A stringified JSON object containing iv, ciphertext, and auditData.
   */
  async encryptForServer(jsonData) {
    const dataString = JSON.stringify(jsonData);
    
    // 1. Generate a new random, single-use key for this piece of data.
    const sessionKey = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
    
    // 2. Encrypt the actual data using this session key.
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(dataString);
    const ciphertextBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sessionKey,
      encodedData
    );
    const ciphertext = btoa(String.fromCharCode(...new Uint8Array(ciphertextBuffer)));

    // 3. Encrypt the session key for the App Owner (auditor).
    // This uses the same ECIES mechanism as the E2EEManager.
    const auditData = await this.keyStore.encryptForAuditor(sessionKey);

    // 4. Package for server storage.
    const encryptedPackage = {
      iv,
      ciphertext,
      auditData,
    };

    return JSON.stringify(encryptedPackage);
  }

  /**
   * Decrypts a payload that was encrypted for server storage.
   * This is the client-side operation to retrieve data.
   * @param {string} encryptedString The stringified JSON from the server.
   * @returns {Promise<object>} The original JSON data.
   */
  async decryptFromServer(encryptedString) {
    const { iv, ciphertext, auditData } = JSON.parse(encryptedString);

    // 1. Decrypt the session key using our own private key.
    // In this simulation, the user is decrypting the key they made.
    // In a real audit, the App Owner would use their master private key.
    const sessionKey = await this.keyStore.decryptFromAuditor(auditData);

    // 2. Decode the ciphertext from Base64
    const ciphertextBuffer = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));

    // 3. Decrypt the data using the recovered session key.
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(Object.values(iv)) },
      sessionKey,
      ciphertextBuffer
    );

    const decryptedString = new TextDecoder().decode(decryptedBuffer);
    return JSON.parse(decryptedString);
  }
}
