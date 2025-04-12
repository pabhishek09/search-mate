import { config } from 'dotenv';
config();

const appConfig = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development'
}

export default appConfig;
