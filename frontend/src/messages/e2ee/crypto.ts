
import { KeyStore } from './keystore';

// Helper function to convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};

// Helper function to convert Base64 to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Generate a new identity key pair
export const generateIdentity = async (): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
};

// Generate a new pre-key pair
export const generatePreKey = async (): Promise<CryptoKeyPair> => {
  return await window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
};

// Sign a public key with the identity key
export const signPublicKey = async (identityKey: CryptoKey, publicKey: CryptoKey): Promise<ArrayBuffer> => {
  const exportedPublicKey = await window.crypto.subtle.exportKey('raw', publicKey);
  return await window.crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    identityKey,
    exportedPublicKey
  );
};

// Verify the signature of a public key
export const verifySignature = async (identityKey: CryptoKey, signature: ArrayBuffer, publicKey: CryptoKey): Promise<boolean> => {
  const exportedPublicKey = await window.crypto.subtle.exportKey('raw', publicKey);
  return await window.crypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    identityKey,
    signature,
    exportedPublicKey
  );
};

// Derive a shared secret using ECDH
export const deriveSharedSecret = async (privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> => {
  return await window.crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

// Encrypt a message using AES-GCM
export const encryptMessage = async (key: CryptoKey, message: string): Promise<{ ciphertext: ArrayBuffer, iv: Uint8Array }> => {
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encodedMessage = new TextEncoder().encode(message);
  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encodedMessage
  );
  return { ciphertext, iv };
};

// Decrypt a message using AES-GCM
export const decryptMessage = async (key: CryptoKey, ciphertext: ArrayBuffer, iv: Uint8Array): Promise<string> => {
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(decrypted);
};
