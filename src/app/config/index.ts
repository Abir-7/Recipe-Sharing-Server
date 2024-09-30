import dotenv from "dotenv";

import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env") });
export const config = {
  port: process.env.PORT,
  node_env: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI,
  bcrypt_sault_round: process.env.BCRYPT_SAULT_ROUND,
  jwt_secrete_key: process.env.JWT_ACCESS_SECRET,
  jwt_secrete_date: process.env.JWT_ACCESS_EXPIRES_IN,
  email_pass: process.env.EMAIL_PASS,
  user_email: process.env.EMAIL_USER,
};
