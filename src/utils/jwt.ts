import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";

const createToken = (payload: JwtPayload, secret: string, expiresIn: SignOptions) => {
  return jwt.sign(
    payload,
    secret,
    {
      expiresIn
    } as SignOptions
  )
}

const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error:any) {
    console.log("Token verification failed ", error);
    return null;
  }
}

export const jwtUtils = {
  createToken,
  verifyToken,
}