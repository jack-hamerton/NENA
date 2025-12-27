
// This is a mock image upload service.
// In a production environment, you would replace this
// with your actual cloud storage provider (e.g., Firebase, AWS S3).

export const uploadImage = async (file) => {
  console.log(`Uploading file: ${file.name}...`);

  // Simulate a 1-second upload time.
  await new Promise(resolve => setTimeout(resolve, 1000));

  // In a real implementation, you would get the URL
  // from your cloud storage provider.
  const mockUrl = `https://picsum.photos/seed/${file.name}/200`;
  
  console.log(`File uploaded successfully: ${mockUrl}`);
  return mockUrl;
};
