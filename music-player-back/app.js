import source from 'koa-static'
import {router, app} from './routes.js'
import koaBody from 'koa-body'
import path from 'path'

// post ctx.request.body get ctx.query

app.use(koaBody({
  formidable: {
    uploadDir: path.join(__dirname, './static'),
    keepExtensions: true,
    multiples: false
  },
  multipart: true
}));
app.use(source('./static'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
