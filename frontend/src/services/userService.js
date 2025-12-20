import { cryptoUtils } from '../utils/crypto';
// This is a mock user service. In a real application, this would be replaced with a proper authentication service like Firebase Auth or Auth0.

let currentUser = null;

export const userService = {
  async login(email, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === 'test@example.com' && password === 'password') {
          currentUser = {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            username: 'testuser',
            profilePicture: 'https://via.placeholder.com/150'
          };
          resolve(currentUser);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  },

  async logout() {
    currentUser = null;
    return Promise.resolve();
  },

  getCurrentUser() {
    return currentUser;
  },

  async updateProfile(user, updates) {
    if (user.id === currentUser?.id) {
        const encryptedUpdates = { ...updates };
        if (updates.name) {
            encryptedUpdates.name = cryptoUtils.encrypt(updates.name);
        }
        if (updates.email) {
            encryptedUpdates.email = cryptoUtils.encrypt(updates.email);
        }
      currentUser = { ...currentUser, ...encryptedUpdates };
      return Promise.resolve(currentUser);
    } else {
      return Promise.reject(new Error('Cannot update another user\'s profile'));
    }
  },

  async uploadProfilePicture(file) {
    // In a real application, you would upload the file to a cloud storage service like Firebase Storage or AWS S3.
    // For this mock service, we'll just return a new placeholder image URL.
    return new Promise((resolve) => {
      setTimeout(() => {
        const newProfilePictureUrl = `https://via.placeholder.com/150?text=${file.name}`;
        currentUser = { ...currentUser, profilePicture: newProfilePictureUrl };
        resolve(currentUser);
      }, 500);
    });
  }
};
