import { Customer } from "./customer.model";

const getAllCustomerInfoFromDb = async () => {
  const result = await Customer.aggregate([
    {
      $lookup: {
        from: "users", // the collection name of the "user" model
        localField: "user", // the field in Customer referring to user
        foreignField: "_id", // the field in the User collection (likely _id)
        as: "userInfo", // name the joined field
      },
    },
    {
      $unwind: "$userInfo", // deconstruct the array returned by $lookup
    },
    {
      $match: {
        "userInfo.isDeleted": { $ne: true }, // ensure user is not deleted
      },
    },
  ]);
  console.log(result);
  return result;
};

export const customerService = {
  getAllCustomerInfoFromDb,
};
