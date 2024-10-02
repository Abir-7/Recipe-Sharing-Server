import { Customer } from "./customer.model";

const getAllCustomerInfoFromDb = async () => {
  const result = await Customer.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: "$userInfo",
    },
    {
      $match: {
        "userInfo.isDeleted": { $ne: true },
      },
    },
    {
      $addFields: {
        user: "$userInfo",
      },
    },
    {
      $project: {
        userInfo: 0, // Exclude the userInfo field
      },
    },
  ]);
  console.log(result);
  return result;
};

export const customerService = {
  getAllCustomerInfoFromDb,
};
