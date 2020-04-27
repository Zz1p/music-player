import {deletePlayListDao, updatePlaylistDao, playListDao, insertPlaylistDao} from "../dao/playlistDao";

let api = new Map();

const playlist = async ctx => {
  const params = ctx.request.query;
  ctx.body = await playListDao(params.id, ctx.db);
};

const updatePlaylist = async ctx => {
  const params = ctx.request.body;
  ctx.body = await updatePlaylistDao(params, ctx.db);
};

const deletePlaylist = async ctx => {
  const params = ctx.request.body;
  ctx.body = await deletePlayListDao(params.id, ctx.db)
};

const createPlaylist = async ctx => {
  const params = ctx.request.body;
  params.picUrl = params.picUrl || '';
  params.songs = params.songs || '';
  ctx.body = await insertPlaylistDao(params, ctx.db);
};

api.set('/api/updatePlaylist', [updatePlaylist, 'post']);
api.set('/api/deletePlaylist', [deletePlaylist, 'post']);
api.set('/api/playlist', [playlist, 'get']);
api.set('/api/createPlaylist', [createPlaylist, 'post']);

export {
  api
}
