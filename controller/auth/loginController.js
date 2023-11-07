import Joi from "joi";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import User from "../../model/user.js";
import refresh from "../../model/refresh.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECERT } from "../../config/index.js";

const loginController = {
  async login(req, res, next) {
    // validate

    const loginSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return next(error);
    }
    let access_token;
    let refresh_token;
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return next(CustomErrorHandler.wrongCredentials());
      }
      // console.log(user)
      //compare the password
      const match = await bcrypt.compare(req.body.password, user.password);

      if (!match) {
        return next(CustomErrorHandler.wrongCredentials());
      }

      // token

      access_token = JwtService.sign({ _id: user._id, role: user.role });
      refresh_token = JwtService.sign(
        { _id: user._id, role: user.role },
        "1y",
        REFRESH_SECERT
      );
      await refresh.create({ token: refresh_token });
    } catch (error) {
      return next(error);
    }
    res.send({ access_token, refresh_token });
  },
  async logout(req, res, next) {
    // validate
    const refreshSchema = Joi.object({
      refresh_token: Joi.string().required(),
    });
    // console.log(req.body);
    const { error } = refreshSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      await refresh.deleteOne({ token: req.body.refresh_token });
    } catch (error) {
      return new Error("something wrong in database");
    }

    res.send({ status: 1 });
  },
};

export default loginController;
