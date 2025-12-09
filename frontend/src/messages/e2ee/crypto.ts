const IV_LENGTH = 12;
const SALT_LENGTH = 16;

export async function generateKeyPair() {
  return window.crypto.subtle.generateKey(
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    ['deriveKey']
  );
}

export async function sign(privateKey: CryptoKey, data: BufferSource): Promise<Uint8Array> {
  const signature = await window.crypto.subtle.sign(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    privateKey,
    data
  );
  return new Uint8Array(signature);
}

export async function verifySignature(publicKey: CryptoKey, signature: BufferSource, data: BufferSource): Promise<boolean> {
  return window.crypto.subtle.verify(
    { name: 'ECDSA', hash: { name: 'SHA-256' } },
    publicKey,
    signature,
    data
  );
}

export async function deriveSharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<CryptoKey> {
  return window.crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicKey },
    privateKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

export async function encryptMessage(sharedSecret: CryptoKey, message: BufferSource): Promise<Uint8Array> {
  const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encryptedMessage = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    sharedSecret,
    message
  );
  const combined = new Uint8Array(iv.length + encryptedMessage.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(encryptedMessage), iv.length);
  return combined;
}

export async function decryptMessage(sharedSecret: CryptoKey, encryptedMessage: BufferSource): Promise<Uint8Array> {
  const iv = (encryptedMessage as Uint8Array).slice(0, IV_LENGTH);
  const message = (encryptedMessage as Uint8Array).slice(IV_LENGTH);
  const decryptedMessage = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    sharedSecret,
    message
  );
  return new Uint8Array(decryptedMessage);
}
