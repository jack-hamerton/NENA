
import { KeyStore } from '../messages/e2ee/keystore';
import { exportPublicKey, arrayBufferToBase64 } from '../utils/crypto';

const API_URL = 'http://localhost:8000/api/v1'; // Assuming the backend is running on port 8000

export async function publishKeys(keyStore: KeyStore, token: string) {
  const publicIdentityKey = await exportPublicKey(keyStore.publicIdentityKey!);
  
  // For simplicity, we'll use the first pre-key.
  const signedPublicPreKey = await keyStore.getSignedPublicPreKey(0);
  if (!signedPublicPreKey) {
    throw new Error('Could not get signed public pre-key');
  }

  const { publicKey, signature } = signedPublicPreKey;
  const publicKeyBase64 = await exportPublicKey(publicKey);
  const signatureBase64 = arrayBufferToBase64(signature);

  const response = await fetch(`${API_URL}/messages/keys`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      public_identity_key: publicIdentityKey,
      signed_public_pre_key: publicKeyBase64,
      signature: signatureBase64
    })
  });

  if (!response.ok) {
    throw new Error('Failed to publish keys');
  }

  return response.json();
}

export async function getKeys(userId: string, token: string) {
  const response = await fetch(`${API_URL}/messages/keys/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to get keys');
  }

  return response.json();
}
