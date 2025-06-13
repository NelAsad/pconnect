// src/common/decorators/permissions.decorator.ts

import { SetMetadata } from '@nestjs/common';

/**
 * Clé utilisée pour stocker les permissions dans le contexte des métadonnées.
 */
export const PERMISSIONS_KEY = 'permissions';

/**
 * Décorateur pour déclarer les permissions nécessaires à une route ou une méthode.
 * @param permissions Liste des permissions requises
 */
export const Permissions = (...permissions: string[]) => SetMetadata(PERMISSIONS_KEY, permissions);
