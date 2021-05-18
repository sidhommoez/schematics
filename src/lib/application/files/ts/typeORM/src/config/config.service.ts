// src/config/config.service.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) { }

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }
    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getPort() {
    return this.getValue('PORT', true);
  }

  public isProduction() {
    const mode = this.getValue('MODE', false);
    return mode !== 'DEV';
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres'  ,
      host: this.getValue('ORM_DB_HOST'),
      port: parseInt(this.getValue('ORM_DB_PORT')),
      username: this.getValue('ORM_DB_USER'),
      password: this.getValue('ORM_DB_PASSWORD'),
      database: this.getValue('ORM_DB_DATABASE'),
      synchronize: JSON.parse(this.getValue('ORM_DB_RUN_MIGRATIONS').toLowerCase()),
      logging:  JSON.parse(this.getValue('ORM_DB_RUN_LOGGER').toLowerCase()),
      entities:  [`${__dirname}/../**/*.entity.{ts,js}`],

      migrationsTableName: 'migration',

      migrations: ['src/migration/*.ts'],

      cli: {
        migrationsDir: 'src/migration',
      },

      ssl: this.isProduction(),
    };
  }

}

const configService = new ConfigService(process.env).ensureValues([
  'ORM_DB_TYPE',
  'ORM_DB_HOST',
  'ORM_DB_PORT',
  'ORM_DB_USER',
  'ORM_DB_PASSWORD',
  'ORM_DB_DATABASE',
  'ORM_DB_RUN_MIGRATIONS',
  'ORM_DB_RUN_LOGGER'
]);

export { configService };
