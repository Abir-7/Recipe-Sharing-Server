import { User } from "../modules/User/user.model";

const superUser = {
  email: "superadmin@gmail.com",
  password: "super123",
  role: "admin",
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: "admin" });

  if (!isSuperAdminExits) {
    await User.create(superUser);
  }
};

export default seedSuperAdmin;
