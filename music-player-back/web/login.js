import utils from "./utils";
let api = new Map();


const login = async ctx => {
  const params = ctx.request.body;
  ctx.body = await utils.getUser(params, ctx.db);
};

api.set("/api/login", [login, 'post']);

export {
  api
}
