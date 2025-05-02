import { S3Client, HeadBucketCommand } from '@aws-sdk/client-s3';

// Initialize S3 Client
const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export async function testAwsConnection() {
  try {
    const command = new HeadBucketCommand({
      Bucket: import.meta.env.VITE_AWS_BUCKET_NAME
    });
    
    await s3Client.send(command);
    console.log('AWS Connection successful!');
    return true;
  } catch (error) {
    console.error('AWS Connection failed:', error);
    return false;
  }
} 