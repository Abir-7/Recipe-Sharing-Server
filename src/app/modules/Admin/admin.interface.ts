import { Types } from "mongoose";
export type TGender = "male" | "female" | "other";
export interface IUserName {
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface IAdmin {
  id: string;
  user: Types.ObjectId;
  password: string;
  name: IUserName;
  email: string;
  gender: TGender;
  phone: number;
  address: string;
  isDeleted: boolean;
}
