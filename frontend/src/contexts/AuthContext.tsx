
import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/firebase';
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { KeyStore } from '../messages/e2ee/keystore';
import { publishKeys, getRecipientKeys } from '../services/api';
import { X3DH } from '../messages/e2ee/x3dh';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [keyStore, setKeyStore] = useState<KeyStore | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const newKeyStore = new KeyStore();
        setKeyStore(newKeyStore);
        
        const token = await user.getIdToken();
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
        const token = await user.getIdToken();
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

  const selectRecipient = (userId: string) => {
    setRecipientId(userId);
  };

  return (
    <AuthContext.Provider value={{ user, keyStore, login, register, logout, selectRecipient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
