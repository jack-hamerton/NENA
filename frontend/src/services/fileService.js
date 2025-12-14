// This is a mock file service. In a real application, this would be replaced with a file storage service like Firebase Storage or AWS S3.

const files = [];

export const fileService = {
  async uploadFile(file, sender, viewOnce) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFile = {
          id: `file-${Date.now()}`,
          name: file.name,
          url: URL.createObjectURL(file), // This is a temporary local URL
          sender,
          timestamp: Date.now(),
          viewOnce,
        };
        files.push(newFile);
        resolve(newFile);
      }, 1000); // Simulate upload time
    });
  },

  async getFiles(channelId) {
    // In a real app, you would fetch files for a specific channel
    return Promise.resolve(files);
  },
};
