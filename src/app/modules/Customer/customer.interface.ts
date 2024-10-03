import { Model, Types } from "mongoose";

export interface ICustomer {
  userName: string;
  email: string;
  phone?: number;
  address?: string;
  bio?: string;
  user: Types.ObjectId;
  photo: string;
  isSubscribed: boolean;
  followers: Types.ObjectId[]; // Array of user references
  following: Types.ObjectId[];
}

export interface ICustomerUpdate {
  phone: number;
  address: string;
  username: string;
  isSubscribed: boolean;
}

export interface CustomerModel extends Model<ICustomer> {
  isCustomerExist(email: string): Promise<ICustomer | null>;
}
