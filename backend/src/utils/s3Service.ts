import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { AppError } from './AppError';
import { v4 as uuidv4 } from 'uuid';
import sharp from "sharp";

export class S3Service {
  private s3Client: S3Client;
  private bucket: string;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
    this.bucket = process.env.AWS_S3_BUCKET || '';
  }

  async uploadFileToS3(buffer: Buffer, fileNameOrigin: string): Promise<string> {
    try {
      const resizedBuffer = await sharp(buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 80 })
        .toBuffer();

      const fileName = `uploads/${uuidv4()}.${fileNameOrigin.replace(/\s+/g, '_')}`;

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: resizedBuffer,
        ContentType: 'image/jpeg',
      });

      await this.s3Client.send(command);
      return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    } catch (error) {
      throw new AppError(error.message, 500);
    }
  }

  async deleteFile(fileUrl: string): Promise<void> {
    try {
      const key = fileUrl.split('.com/')[1];
      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new AppError('Error deleting file from S3', 500);
    }
  }
} 