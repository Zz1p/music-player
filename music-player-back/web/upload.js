import path from 'path'
import {insertSongDao} from '../dao/songDao'
import {insertPlaylistDao} from "../dao/playlistDao";
let api = new Map();

const uploadSong = async ctx => {
  console.log(ctx.request.body);
  const file = ctx.request.files['file'];
  const pic = ctx.request.files['pic'];
  const body = ctx.request.body;
  const filename = path.basename(file.path);
  const picName = path.basename(pic.path);
  file.path = `${ctx.origin}/${filename}`;
  pic.path = `${ctx.origin}/${picName}`;
  const params = {
    name: body.name || '',
    filename,
    url: file.path,
    picUrl: pic.path,
    author: body.author || ''
  };
  const result = await insertSongDao(params, ctx.db);
  if (!result) {
    return ctx.body = {
      errMessage: 'Internal Server Error'
    }
  }
  ctx.body = {
    errMessage: 'ok'
  }
};

const uploadPlaylist = async ctx => {
  const pic = ctx.request.files['pic'];
  const body = ctx.request.body;
  const picName = path.basename(pic.path);
  pic.path = `${ctx.origin}/${picName}`;
  const params = {
    name: body.name,
    picUrl: pic.path,
    songs: body.songs || ''
  };
  const result = await insertPlaylistDao(params, ctx.db);
  if (!result) {
    return ctx.body = {
      errMessage: 'Internal Server Error'
    }
  }
  ctx.body = {
    errMessage: 'ok'
  }
};


api.set('/api/uploadSong', [uploadSong, 'post']);
api.set('/api/uploadPlaylist', [uploadPlaylist, 'post']);
export {
  api
}
