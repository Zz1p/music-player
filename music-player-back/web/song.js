import {deleteSongDao, getSongByNameDao, getSongsByIdDao, getSongsDao} from "../dao/songDao";

let api = new Map();

const getSongsById = async ctx => {
  const params = ctx.request.query;
  ctx.body = await getSongsByIdDao(params, ctx.db);
};

const song = async ctx => {
  ctx.body = await getSongsDao(ctx.db)
};

const deleteSong = async ctx => {
  const id = ctx.request.body.id;
  ctx.body = await deleteSongDao(id, ctx.db)
};

const getSongByName = async ctx => {
  const name = ctx.request.query.name;
  ctx.body = await getSongByNameDao(name, ctx.db);
};

api.set('/api/getSongsById', [getSongsById, 'get']);
api.set('/api/song', [song, 'get']);
api.set('/api/deleteSong', [deleteSong, 'post']);
api.set('/api/getSongByName', [getSongByName, 'get']);

export {
  api
}
