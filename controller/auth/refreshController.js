import { REFRESH_SECERT } from "../../config/index.js";
import Joi from "joi";
import refresh from "../../model/refresh.js";
import User from "../../model/user.js";

import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";

const refreshController = {
  async refresh(req, res, next) {
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    // console.log(req.body);
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      //validate

      // check in the database
      let refreshtoken;

      refreshtoken = await refresh.findOne({ token: req.body.refresh_token });

      console.log(refreshtoken);

      if (!refresh) {
        return next(CustomErrorHandler.unAuthorized("Invaild Refresh Token"));
      }
      let userId;
      try {
        const { _id } = await JwtService.verify(
          refreshtoken.token,
          REFRESH_SECERT
        );
        userId = _id;
      } catch (error) {
        return next(CustomErrorHandler.unAuthorized("Invaild Refresh Token"));
      }

      const user = await User.findOne({ _id: userId });

      console.log(user);

      if (!user) {
        return next(CustomErrorHandler.notFound("user not found"));
      }

      //token
      const access_token = JwtService.sign({ _id: user._id, role: user.role });
      const refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECERT
      );

      await refresh.create({ token: refresh_token });

      res.status(201).send({ access_token, refresh_token });
    } catch (error) {
      return new Error("Something went wrong " + error.message);
    }
  },
};

export default refreshController;
