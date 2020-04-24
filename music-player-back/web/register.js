import utils from "./utils";
let path = new Map();


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

path.set("/api/register", [register, 'post']);

export {
  path
}
