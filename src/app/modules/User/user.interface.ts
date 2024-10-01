export interface IUser {
  email: string;
  password: string; // Must be hashed;
  role: "admin" | "user" | "superAdmin";
  isDeleted: boolean;
  isblocked: boolean;
}

export type T_UserRole = "superAdmin" | "admin" | "user";
