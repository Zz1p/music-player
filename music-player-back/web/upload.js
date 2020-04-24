let api = new Map();
import path from 'path'

const upload = async ctx => {
  const file = ctx.request.files['file\n'];
  console.log(file);
  console.log('origin', ctx.origin);
  const basename = path.basename(file.path);
  file.path = `${ctx.origin}/uploads/${basename}`;
  ctx.body = file
};

api.set("/api/upload", [upload, 'post']);

export {
  api
}
