import axios from 'axios';
import { KeyStore } from '../messages/e2ee/keystore';
import { encryptMessage, decryptMessage, deriveSharedSecret } from '../messages/e2ee/crypto';

const apiClient = axios.create({
  baseURL: '/api/v1',
});

const keyStore = new KeyStore();

export const publishKeys = async () => {
    const publicKey = await window.crypto.subtle.exportKey('raw', keyStore.identityKey.publicKey);
    const signedPublicPreKey = await keyStore.getSignedPublicPreKey(0);
    const response = await apiClient.post('/keys', {
        publicKey: Buffer.from(publicKey).toString('hex'),
        signedPublicPreKey: {
            publicKey: Buffer.from(signedPublicPreKey.publicKey).toString('hex'),
            signature: Buffer.from(signedPublicPreKey.signature).toString('hex'),
        },
    });
    return response.data;
};

export const getRecipientKeys = async (recipientId) => {
  const response = await apiClient.get(`/keys/${recipientId}`);
  return response.data;
};

export const sendMessage = async (recipientId, message) => {
  const recipientKeys = await getRecipientKeys(recipientId);
  const theirPublicKey = await window.crypto.subtle.importKey(
    'raw',
    Buffer.from(recipientKeys.publicKey, 'hex'),
    { name: 'ECDH', namedCurve: 'P-256' },
    true,
    []
  );

  const sharedSecret = await deriveSharedSecret(await keyStore.getPrivateKey(), theirPublicKey);

  const encryptedMessage = await encryptMessage(sharedSecret, new TextEncoder().encode(message));

  await apiClient.post('/messages', {
    recipientId,
    message: Buffer.from(encryptedMessage).toString('hex'),
  });
};

export const getMessages = async () => {
    const response = await apiClient.get('/messages');
    const messages = response.data;

    const decryptedMessages = await Promise.all(
        messages.map(async (message) => {
            const senderKeys = await getRecipientKeys(message.senderId);
            const theirPublicKey = await window.crypto.subtle.importKey(
                'raw',
                Buffer.from(senderKeys.publicKey, 'hex'),
                { name: 'ECDH', namedCurve: 'P-256' },
                true,
                []
            );
            const sharedSecret = await deriveSharedSecret(await keyStore.getPrivateKey(), theirPublicKey);
            const decryptedMessage = await decryptMessage(sharedSecret, Buffer.from(message.message, 'hex'));
            return { ...message, message: new TextDecoder().decode(decryptedMessage) };
        })
    );

    return decryptedMessages;
};