#!/usr/bin/env node

/**
 * Database backup script
 * Exports PostgreSQL database to S3
 *
 * Usage:
 *   npx ts-node scripts/backup-database.ts
 *
 * Environment variables required:
 *   DATABASE_URL
 *   AWS_ACCESS_KEY_ID (optional, for S3 backup)
 *   AWS_SECRET_ACCESS_KEY (optional, for S3 backup)
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { readFileSync, unlinkSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

interface BackupConfig {
  databaseUrl: string;
  backupDir?: string;
  uploadToS3?: boolean;
  s3Bucket?: string;
  s3Region?: string;
  retentionDays?: number;
}

async function createDatabaseBackup(config: BackupConfig): Promise<string> {
  const timestamp = new Date().toISOString().replace(/:/g, '-');
  const backupFilename = `nexus-ai-backup-${timestamp}.sql`;
  const backupPath = path.join(config.backupDir || './backups', backupFilename);

  console.log(`📦 Creating database backup: ${backupFilename}`);

  try {
    // Parse database URL
    const dbUrl = new URL(config.databaseUrl);
    const host = dbUrl.hostname;
    const port = dbUrl.port || '5432';
    const username = dbUrl.username;
    const password = dbUrl.password;
    const database = dbUrl.pathname.replace('/', '');

    // Set up environment variables for pg_dump
    const env = {
      ...process.env,
      PGPASSWORD: password,
    };

    // Execute pg_dump
    const command = `pg_dump -h ${host} -p ${port} -U ${username} -d ${database} > ${backupPath}`;

    await execAsync(command, { env });

    console.log(`✅ Backup created: ${backupPath}`);
    return backupPath;
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  }
}

async function uploadToS3(filePath: string, bucket: string, region: string): Promise<void> {
  console.log(`📤 Uploading to S3: s3://${bucket}/${path.basename(filePath)}`);

  // Note: This requires AWS SDK v3
  // In production, use: npm install @aws-sdk/client-s3

  // For now, we'll use AWS CLI if available
  const filename = path.basename(filePath);
  const s3Path = `s3://${bucket}/backups/${filename}`;

  try {
    await execAsync(`aws s3 cp ${filePath} ${s3Path} --region ${region}`);
    console.log(`✅ Uploaded to ${s3Path}`);
  } catch (error) {
    console.error('❌ S3 upload failed:', error);
    throw error;
  }
}

async function verifyBackup(filePath: string): Promise<void> {
  console.log('🔍 Verifying backup integrity...');

  try {
    const stats = require('fs').statSync(filePath);
    const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

    if (stats.size === 0) {
      throw new Error('Backup file is empty');
    }

    console.log(`✅ Backup verified: ${sizeInMB} MB`);
  } catch (error) {
    console.error('❌ Verification failed:', error);
    throw error;
  }
}

async function cleanOldBackups(
  backupDir: string,
  retentionDays: number
): Promise<void> {
  console.log(`🧹 Cleaning backups older than ${retentionDays} days`);

  try {
    const fs = require('fs');
    const files = fs.readdirSync(backupDir);
    const now = Date.now();
    const retentionMs = retentionDays * 24 * 60 * 60 * 1000;

    let deletedCount = 0;
    for (const file of files) {
      if (!file.startsWith('nexus-ai-backup-')) {
        continue;
      }

      const filePath = path.join(backupDir, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;

      if (fileAge > retentionMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
        console.log(`  Deleted: ${file}`);
      }
    }

    console.log(`✅ Deleted ${deletedCount} old backups`);
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    throw error;
  }
}

async function main() {
  const config: BackupConfig = {
    databaseUrl: process.env.DATABASE_URL || '',
    backupDir: process.env.BACKUP_DIR || './backups',
    uploadToS3: !!process.env.AWS_BUCKET,
    s3Bucket: process.env.AWS_BUCKET,
    s3Region: process.env.AWS_REGION || 'us-east-1',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  };

  if (!config.databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is required');
    process.exit(1);
  }

  try {
    // Create backups directory if it doesn't exist
    const fs = require('fs');
    if (!fs.existsSync(config.backupDir)) {
      fs.mkdirSync(config.backupDir, { recursive: true });
    }

    // Create backup
    const backupPath = await createDatabaseBackup(config);

    // Verify backup
    await verifyBackup(backupPath);

    // Upload to S3 if configured
    if (config.uploadToS3 && config.s3Bucket) {
      await uploadToS3(backupPath, config.s3Bucket, config.s3Region!);
    }

    // Clean old backups
    if (config.backupDir) {
      await cleanOldBackups(config.backupDir, config.retentionDays || 30);
    }

    console.log('\n✅ Backup process completed successfully');
  } catch (error) {
    console.error('\n❌ Backup process failed:', error);
    process.exit(1);
  }
}

main();
