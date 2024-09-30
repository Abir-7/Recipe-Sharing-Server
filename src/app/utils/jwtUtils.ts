import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "../config";
import AppError from "../errors/AppError";

// Assuming you have a custom error class

// Utility function to verify JWT
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(
      token,
      config.jwt_secrete_key as string
    ) as JwtPayload;
    return decoded;
  } catch (error) {
    // Handle JWT-specific errors
    throw new AppError(401, "Invalid or expired token");
  }
};
