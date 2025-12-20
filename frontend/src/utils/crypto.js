
import crypto from 'crypto-browserify';

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16; // For AES, this is always 16

// This key should be securely derived from a shared secret, e.g., using Diffie-Hellman
// For demonstration, we'll use a hardcoded key. 
// In a real application, this would be handled by a key exchange mechanism.
const ENCRYPTION_KEY = Buffer.from('c293b7a8b6a3a41a8790203a74b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3', 'hex');

function encrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

function decrypt(text) {
  const textParts = text.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedText = Buffer.from(textParts.join(':'), 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const cryptoUtils = {
  encrypt,
  decrypt,
};
