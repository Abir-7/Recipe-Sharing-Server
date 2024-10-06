import { NextFunction, Request, Response } from "express";

import catchAsync from "../../utils/catchAsync";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import jwt, { JwtPayload } from "jsonwebtoken";
import { T_UserRole } from "../../modules/User/user.interface";
import { config } from "../../config";
import { User } from "../../modules/User/user.model";
import { any } from "zod";

export const auth = (...userRole: T_UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const tokenData = req.headers.authorization;

    const token = tokenData;

    if (!token) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route1"
      );
    }
    console.log("hit");

    try {
      const decoded = jwt.verify(
        token,
        config.jwt_secrete_key as string
      ) as JwtPayload;

      const { role, email } = decoded as JwtPayload;

      const user = await User.findOne({ email: email });
      //check user exixt or not
      if (!user) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          "You have no access to this route2",
          ""
        );
      }

      if (userRole && !userRole.includes(role)) {
        throw new AppError(
          httpStatus.UNAUTHORIZED,
          "You have no access to this route3",
          ""
        );
      }

      req.user = decoded as JwtPayload;
      next();
    } catch (error: any) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        "You have no access to this route"
      );
    }
  });
};
