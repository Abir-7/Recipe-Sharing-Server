import httpStatus from "http-status";
import { ICustomerUpdate } from "./customer.interface";
import { Customer } from "./customer.model";

import { JwtPayload } from "jsonwebtoken";
import AppError from "../../errors/AppError";
import { IAuthUserInfo } from "../../interface/global.interface";

const updateCustomerFromDB = async (
  email: string,
  data: Partial<ICustomerUpdate>
) => {
  const customerData = await Customer.isCustomerExist(email);
  if (!customerData) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found to update");
  }

  const { name, ...remainingStudentData } = data;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Customer.findOneAndUpdate(
    { email },
    modifiedUpdatedData,
    {
      new: true,
    }
  );
  return result;
};

const getCustomerInfoFromDb = async (userData: JwtPayload & IAuthUserInfo) => {
  const result = await Customer.findOne({ email: userData.userEmail });
  return result;
};

export const customerService = {
  updateCustomerFromDB,
  getCustomerInfoFromDb,
};
