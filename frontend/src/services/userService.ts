// This is a mock user service. In a real application, this would be replaced with a proper authentication service like Firebase Auth or Auth0.

export interface User {
  id: string;
  name: string;
  email: string;
}

let currentUser: User | null = null;

export const userService = {
  async login(email: string, password: string): Promise<User> {
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

  async logout(): Promise<void> {
    currentUser = null;
    return Promise.resolve();
  },

  getCurrentUser(): User | null {
    return currentUser;
  },

  async updateProfile(user: User, updates: Partial<User>): Promise<User> {
    if (user.id === currentUser?.id) {
      currentUser = { ...currentUser, ...updates };
      return Promise.resolve(currentUser);
    } else {
      return Promise.reject(new Error('Cannot update another user\'s profile'));
    }
  },
};
