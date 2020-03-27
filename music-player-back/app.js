import Koa from 'koa';
import source from 'koa-static';
import bodyParser from 'koa-bodyparser';
import router from './routes.js';

// post ctx.request.fields get ctx.query
const app = new Koa();
app.use(bodyParser());


app.use(source('./static'));
app.use(router.routes());
app.listen(3000);
