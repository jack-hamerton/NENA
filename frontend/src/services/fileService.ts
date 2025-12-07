// This is a mock file service. In a real application, this would be replaced with a file storage service like Firebase Storage or AWS S3.

export interface SharedFile {
  id: string;
  name: string;
  url: string;
  sender: {
    id: string;
    name: string;
  };
  timestamp: number;
}

const files: SharedFile[] = [];

export const fileService = {
  async uploadFile(file: File, sender: { id: string; name: string }): Promise<SharedFile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFile: SharedFile = {
          id: `file-${Date.now()}`,
          name: file.name,
          url: URL.createObjectURL(file), // This is a temporary local URL
          sender,
          timestamp: Date.now(),
        };
        files.push(newFile);
        resolve(newFile);
      }, 1000); // Simulate upload time
    });
  },

  async getFiles(channelId: string): Promise<SharedFile[]> {
    // In a real app, you would fetch files for a specific channel
    return Promise.resolve(files);
  },
};
