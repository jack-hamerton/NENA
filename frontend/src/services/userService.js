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
      currentUser = { ...currentUser, ...updates };
      return Promise.resolve(currentUser);
    } else {
      return Promise.reject(new Error('Cannot update another user\'s profile'));
    }
  },
};
