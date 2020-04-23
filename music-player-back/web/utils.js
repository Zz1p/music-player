import getUserDao from "../dao/getUserDao";
import jwt from "jsonwebtoken";

const jwtSecret = 'music_player_token';


export default new class utils {
  async getUser(user, db) {
    const result = await getUserDao(user.username, user.password, db);
    if (result.length === 0) {
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
}


