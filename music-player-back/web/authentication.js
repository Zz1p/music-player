import jwt from "jsonwebtoken";
import utils from './utils';

let path = new Map();
const jwtSecret = 'music_player_token';

const authentication = async ctx => {
  let errFlag = false;
  const token = ctx.request.headers.authorization.split(' ')[1];
  const decode = await jwt.verify(token, jwtSecret, (err, decode) => {
    if (err) {
      errFlag = true;
      return err;
    }
    return decode;
  });
  if (errFlag) {
    return ctx.body = {
      validUser: false
    }
  }
  ctx.body = await utils.getUser(decode, ctx.db);
};

path.set("/api/auth", [authentication, 'get']);

export {
  path
}
