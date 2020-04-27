import {getPostersDao, insertPosterDao, deletePosterDao} from "../dao/posterDao";

let api = new Map();

const getPosters = async ctx => {
  const params = ctx.request.query;
  ctx.body = await getPostersDao(params, ctx.db);
};

const addPoster = async ctx => {
  const params = ctx.request.body;
  ctx.body = await insertPosterDao(params, ctx.db);
};

const deletePoster = async ctx => {
  const params = ctx.request.body;
  ctx.body = await deletePosterDao(params, ctx.db);
};

api.set('/api/getPosters', [getPosters, 'get']);
api.set('/api/addPoster', [addPoster, 'post']);
api.set('/api/deletePoster', [deletePoster, 'post']);


export {
  api
}
