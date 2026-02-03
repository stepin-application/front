import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET() {
  try {
    // Lire le fichier package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf-8');
    const packageData = JSON.parse(packageJsonContent);

    // Ajouter des informations système supplémentaires
    const systemInfo = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
      memory: {
        total: Math.round(os.totalmem() / 1024 / 1024),
        free: Math.round(os.freemem() / 1024 / 1024),
      },
      nodeVersion: process.version,
      uptime: os.uptime(),
    };

    return NextResponse.json({
      ...packageData,
      systemInfo,
      serverTime: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error fetching dev info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dev info' },
      { status: 500 }
    );
  }
} 