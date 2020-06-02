import {deletePlayListDao, updatePlaylistDao, playListDao} from "../dao/playlistDao";

let api = new Map();

const playlist = async ctx => {
  const params = ctx.request.query;
  ctx.body = await playListDao(params.name, ctx.db);
};

const updatePlaylist = async ctx => {
  const params = ctx.request.body;
  ctx.body = await updatePlaylistDao(params, ctx.db);
};

const deletePlaylist = async ctx => {
  const params = ctx.request.body;
  ctx.body = await deletePlayListDao(params.id, ctx.db)
};


api.set('/api/updatePlaylist', [updatePlaylist, 'post']);
api.set('/api/deletePlaylist', [deletePlaylist, 'post']);
api.set('/api/playlist', [playlist, 'get']);

export {
  api
}
