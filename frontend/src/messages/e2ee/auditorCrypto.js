
const AUDITOR_PUBLIC_KEY = {
  "kty": "RSA",
  "n": "y1ydpcekLpM2DzXalJ7BtG3xUi6KS5SbPQzGp5IibUXYwOKru8gh-kjOHrauKfxYYvX9sN9_tlWRx5p17pC_2Yw_i9PFpwxnLjSgwE7ZSvgjb4-ze_ybTCNC_nPQrMndaEONKoo6UVCszU06nQ4Bf4r4dv10qQX5q_4T2cighOoI02sBeqFBPMRtIHqKd9yCElSvmtDmIhpFqh-8O9Gwe7W9R65XYRT2qcLrBgfF1kPFwiNdjn8ycChUHnrcvjHXntZl-XnARrT5At6h-4A3dyhGKKtan-ivmqdKw7XhbGszRsnR99xK0W6RZSto_mPf4t5Ny1C_J3Y-K5mEP_32UQ",
  "e": "AQAB"
};

/**
 * Imports a JWK public key for use with the Web Crypto API.
 * @returns {Promise<CryptoKey>} The imported CryptoKey object.
 */
async function importAuditorPublicKey() {
  return await crypto.subtle.importKey(
    'jwk',
    AUDITOR_PUBLIC_KEY,
    {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    },
    true,
    ['encrypt']
  );
}

/**
 * Encrypts a session key (as a hex string) using the auditor's public key.
 * @param {string} sessionKeyHex - The session key to encrypt, encoded as a hex string.
 * @returns {Promise<string>} The base64-encoded encrypted session key.
 */
export async function encryptSessionKeyForAuditor(sessionKeyHex) {
  try {
    const publicKey = await importAuditorPublicKey();
    const sessionKeyBytes = new TextEncoder().encode(sessionKeyHex);

    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP',
      },
      publicKey,
      sessionKeyBytes
    );

    // Return as a base64 string, which is standard for web transport
    return btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));
  } catch (error) {
    console.error("Failed to encrypt session key for auditor:", error);
    // In a real app, you might want to handle this more gracefully.
    // For now, we return null to indicate failure.
    return null;
  }
}
