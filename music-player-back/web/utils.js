import {getUserDao, getUserByUsernameDao,insertUserDao} from "../dao/userDao";
import jwt from "jsonwebtoken";

const jwtSecret = 'music_player_token';


export default new class utils {
  async getUser(user, db) {
    const result = await getUserDao(user, db);
    if (!result.length) {
      return {
        validUser: false
      }
    }
    const RowDataPacket = result[0];
    return {
      validUser: true,
      userInfo: {
        ...RowDataPacket,
        token: jwt.sign({
          username: RowDataPacket.username,
          password: RowDataPacket.password
        }, jwtSecret, {expiresIn: 60 * 60 * 24 * 7})
      }
    }
  };
  async getUserByUsername(username, db) {
    return await getUserByUsernameDao(username, db)
  };
  async insertUser(params, db) {
    return await insertUserDao(params, db)
  }
}


