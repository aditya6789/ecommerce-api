import Joi from "joi";
import User from "../../model/user.js";
import refresh from "../../model/refresh.js";
import bcrypt from "bcrypt";
import CustomErrorHandler from "../../services/CustomErrorHandler.js";
import JwtService from "../../services/JwtService.js";
import { REFRESH_SECERT } from "../../config/index.js";

const registerController = {
  async register(req, res, next) {
    // validate

    const registerSchema = Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      repeat_password: Joi.ref("password"),
    });
    // console.log(req.body);
    const { error } = registerSchema.validate(req.body);

    if (error) {
      return next(error);
    }

    //if user exists already!!

    try {
      const exists = await User.exists({ email: req.body.email });
      // const customError = CustomErrorHandler.alreadyExist("Some error message");

      if (exists) {
        return next(
          CustomErrorHandler.alreadyExist("This Email is Already Taken !")
        );
      }
    } catch (error) {
      return next(error);
    }

    // hashed password

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(req.body.password, 10);
    } catch (error) {
      return next(error);
    }

    const { name, email } = req.body;

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    let access_token;
    let refresh_token;
    try {
      const result = await user.save();

      //token
      access_token = JwtService.sign({ _id: result._id, role: result.role });
      refresh_token = JwtService.sign(
        { _id: result._id, role: result.role },
        "1y",
        REFRESH_SECERT
      );
      await refresh.create({ token: refresh_token });
    } catch (error) {
      return next(error);
    }

    res.send({ access_token, refresh_token });
  },
};

export default registerController;
