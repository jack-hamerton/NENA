export interface SharedFile {
  id: string;
  name: string;
  url: string;
  sender: { id: string; name: string };
  timestamp: number;
  viewOnce: boolean;
}

const files: SharedFile[] = [];

export const fileService = {
  async uploadFile(file: File, sender: { id: string; name: string }, viewOnce: boolean): Promise<SharedFile> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newFile: SharedFile = {
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

  async getFiles(channelId: string): Promise<SharedFile[]> {
    // In a real app, you would fetch files for a specific channel
    return Promise.resolve(files);
  },
};
