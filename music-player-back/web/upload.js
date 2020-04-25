import path from 'path'
import {insertSongDao} from '../dao/songDao'
let api = new Map();

const upload = async ctx => {
  const file = ctx.request.files['file'];
  if (file.type !== 'audio/mpeg') {
    return ctx.body = {
      errorMessage: 'wrong file type'
    }
  }
  const body = ctx.request.body;
  const filename = path.basename(file.path);
  file.path = `${ctx.origin}/${filename}`;
  const params = {
    name: body.name,
    filename,
    url: file.path,
    author: body.author
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

api.set("/api/upload", [upload, 'post']);

export {
  api
}
