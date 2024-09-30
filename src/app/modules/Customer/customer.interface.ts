import { Model, Types } from "mongoose";

export interface ICustomer {
  userName: string;
  email: string;
  phone?: number;
  address?: string;
  user: Types.ObjectId;
  photo: string;
}

export interface ICustomerUpdate {
  phone: number;
  address: string;
  username: string;
}

export interface CustomerModel extends Model<ICustomer> {
  isCustomerExist(email: string): Promise<ICustomer | null>;
}
