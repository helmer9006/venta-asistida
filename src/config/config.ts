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
      EDIT_PROFILE: 'update_profile'
    }
  };
});