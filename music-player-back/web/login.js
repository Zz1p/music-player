import utils from "./utils";
let path = new Map();


const login = async ctx => {
  const params = ctx.request.body;
  ctx.body = await utils.getUser(params, ctx.db);
};

path.set("/api/login", [login, 'post']);

export {
  path
}
