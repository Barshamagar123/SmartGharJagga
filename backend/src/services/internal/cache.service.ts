import { createClient, RedisClientType } from 'redis';
import { config } from '@/config';

export class CacheService {
  private client: RedisClientType;
  private isConnected = false;
  private connectionAttempted = false;

  constructor() {
    this.client = createClient({
      url: config.REDIS_URL,
      socket: {
        reconnectStrategy: (retries) => {
          if (retries > 3) {
            return false;
          }
          return Math.min(retries * 1000, 3000);
        },
      },
    });

    this.client.on('error', () => {
      if (!this.connectionAttempted) {
        console.warn('⚠️  Redis not available - cache features disabled.');
        this.connectionAttempted = true;
      }
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      this.isConnected = true;
      this.connectionAttempted = true;
      console.log('✅ Redis connected');
    });

    this.client.on('reconnect', () => {
      this.isConnected = true;
    });

    this.client.on('end', () => {
      this.isConnected = false;
    });

    this.client.connect().catch(() => {});
  }

  async get(key: string): Promise<string | null> {
    if (!this.isConnected) return null;
    try {
      return await this.client.get(key);
    } catch {
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (!this.isConnected) return;
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch {
      // Silently fail
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.isConnected) return;
    try {
      await this.client.del(key);
    } catch {
      // Silently fail
    }
  }

  async exists(key: string): Promise<boolean> {
    if (!this.isConnected) return false;
    try {
      return (await this.client.exists(key)) === 1;
    } catch {
      return false;
    }
  }
}
