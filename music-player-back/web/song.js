import {getSongsByIdDao, getSongsDao} from "../dao/songDao";

let api = new Map();

const getSongsById = async ctx => {
  const params = ctx.request.query;
  const result = await getSongsByIdDao(params, ctx.db);
  console.log(result);
  ctx.body = result;
};

const song = async ctx => {
  ctx.body = await getSongsDao(ctx.db)
};

api.set('/api/getSongsById', [getSongsById, 'get']);
api.set('/api/song', [song, 'get']);

export {
  api
}
