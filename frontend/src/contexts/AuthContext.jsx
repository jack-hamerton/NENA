
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { KeyStore } from '../messages/e2ee/keystore';
import { publishKeys, getRecipientKeys } from '../services/api';
import { X3DH } from '../messages/e2ee/x3dh';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [keyStore, setKeyStore] = useState(null);
  const [recipientId, setRecipientId] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const newKeyStore = new KeyStore();
        setKeyStore(newKeyStore);
        
        await user.getIdToken();
        try {
          await publishKeys();
          console.log('Public keys published successfully');
        } catch (error) {
          console.error('Failed to publish public keys:', error);
        }

      } else {
        setKeyStore(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const establishSession = async () => {
      if (user && keyStore && recipientId) {
        await user.getIdToken();
        try {
          const recipientKeys = await getRecipientKeys(recipientId);
          const x3dh = new X3DH(keyStore);
          await x3dh.establishSession(recipientKeys.public_identity_key, recipientKeys.signed_public_pre_key, recipientKeys.signature);
          console.log('Secure session established successfully');
        } catch (error) {
          console.error('Failed to establish secure session:', error);
        }
      }
    };

    establishSession();
  }, [user, keyStore, recipientId]);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const selectRecipient = (userId) => {
    setRecipientId(userId);
  };

  return (
    <AuthContext.Provider value={{ user, keyStore, login, register, logout, selectRecipient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
