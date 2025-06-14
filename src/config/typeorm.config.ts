// -----------------------------------------------------------------------------
// Configuration asynchrone de TypeORM pour NestJS
// Centralise la configuration de la connexion à la base de données MySQL
// Utilise le ConfigService pour injecter dynamiquement les variables d'environnement
// -----------------------------------------------------------------------------
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * Fournit la configuration TypeORM de manière asynchrone
 * Permet de charger dynamiquement les paramètres depuis le ConfigService
 * À utiliser dans l'import du module principal (AppModule)
 */
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
    synchronize: true, // désactivez en production pour éviter la perte de données
    logging: false,
  }),
};
