export interface IUser {
  email: string;
  password: string; // Must be hashed;
  role: "admin" | "user" | "superAdmin";
}

export type T_UserRole = "superAdmin" | "admin" | "user";
