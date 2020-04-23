import jwt from "jsonwebtoken";
import utils from './utils';

let path = new Map();
const jwtSecret = 'music_player_token';


const login = async ctx => {
  const params = ctx.request.body;
  ctx.body = await utils.getUser(params, ctx.db);
};


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
path.set("/api/login", [login, 'post']);

export {
  path
}
