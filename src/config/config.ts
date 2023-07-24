import { registerAs } from '@nestjs/config';
import * as msal from '@azure/msal-node';
export default registerAs('config', () => {
  return {
    jwtSecret: process.env.JWT_SECRET,
    exampleProviderGetService: process.env.EXAMPLE_PROVIDER_GET_SERVICE,
    unleash: {
      apiUrl: process.env.UNLEASH_API_URL,
      apiKey: process.env.UNLEASH_API_KEY,
      refreshTime: process.env.UNLEASH_REFRESH_TIME,
    },
    swaggerPassword: process.env.SWAGGER_PASS,
    redisUrl: process.env.REDIS_URL,
    APP_B2C_STATES: {
      LOGIN: 'login',
      LOGOUT: 'logout',
      PASSWORD_RESET: 'password_reset',
      EDIT_PROFILE: 'update_profile',
    },
    AUDIT_ACTIONS: {
      USER_CREATE: {
        action: 'USER_CREATE',
        description: 'Nuevo usuario creado en el sistema.',
      },
      USER_UPDATE: {
        action: 'USER_UPDATE',
        description: 'El usuario fue actualizado',
      },
      USER_DISABLE: {
        action: 'USER_DISABLE',
        description: 'El usuario fue desabilitado en el sistema.',
      },
      ROLE_CREATE: {
        action: 'ROLE_CREATE',
        description: 'Nuevo rol creado en el sistema.',
      },
      ROLE_UPDATE: {
        action: 'ROLE_UPDATE',
        description: 'El Rol fue actualizado.',
      },
      ROLE_DISABLE: {
        action: 'ROLE_DISABLE',
        description: 'El rol fue desabilitado en el sistema.',
      },
    },
    MODELS: {
      USERS: 'Users',
      ROLES: 'Roles',
      PERMISSIONS: 'Permissions',
      PRODUCTS: 'Products',
      SALES: 'Sales',
    }
  };
});
