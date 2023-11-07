import { JWT_SECERT } from "../config/index.js";
import jwt from "jsonwebtoken";

class JwtService {
  static sign(payload, expiry = "1y", secert = JWT_SECERT) {
    return jwt.sign(payload, secert, { expiresIn: expiry });
  }

  static verify(token, secert = JWT_SECERT) {
    return jwt.verify(token, secert);
  }
}

export default JwtService;
