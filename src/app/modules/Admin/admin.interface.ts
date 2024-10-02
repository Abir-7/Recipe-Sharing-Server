import { Types } from "mongoose";
export type TGender = "male" | "female" | "other";

export interface IAdmin {
  id: string;
  user: Types.ObjectId;
  userName: string;
  email: string;
  phone: number;
  address: string;
  photo: string;
}
