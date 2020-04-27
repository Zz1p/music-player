import {updateUserCollectionDao} from "../dao/userDao";
import utils from "./utils";
let api = new Map();

const register = async ctx => {
  const params = ctx.request.body;
  const validUser = await utils.getUserByUsername(params.username, ctx.db);
  if (validUser.length) {
    return ctx.body = {
      errMessage: '用户已存在'
    }
  }
  ctx.body = await utils.insertUser(params, ctx.db)
};

const login = async ctx => {
  const params = ctx.request.body;
  ctx.body = await utils.getUser(params, ctx.db);
};

const updateUserCollection = async ctx => {
  const params = ctx.request.body;
  console.log(params);
  ctx.body = await updateUserCollectionDao(params, ctx.db)
};

api.set("/api/login", [login, 'post']);
api.set("/api/register", [register, 'post']);
api.set("/api/updateUserCollection", [updateUserCollection, 'post']);

export {
  api
}
