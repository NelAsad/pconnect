import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

export const typeOrmAsyncConfig = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT'),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_NAME'),
    entities: [__dirname + '/../**/entities/*.entity{.ts,.js}'],
    synchronize: true, // désactive en prod
    logging: false,
  }),
};
