import dotenv from 'dotenv';

dotenv.config();

export const {APP_PORT , DEBUG_MODE , DB_URL , JWT_SECERT , REFRESH_SECERT} = process.env;