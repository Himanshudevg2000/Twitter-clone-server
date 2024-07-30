import JWT from "jsonwebtoken";
import { prismaClient } from "../clients/db";
import { User } from "@prisma/client";
import { JWTUser } from "../interfaces";

const JWT_SECRET = "$uper@12345";

class JWTService {
  public static generateTokenForUser(user: User) {
    const payload : JWTUser = {
      id: user?.id,
      email: user?.email,
    };

    const token = JWT.sign(payload, JWT_SECRET);
    console.log('token: ', token);
    return token;
  }

  public static decodeToken(token: string){

    try{

      console.log('decodetoken: ', token);
      return JWT.verify(token, JWT_SECRET) as JWTUser
    }
    catch{
      return null;
    }
  }
}

export default JWTService;
