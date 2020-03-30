import Koa from 'koa';
import source from 'koa-static';
import bodyParser from 'koa-bodyparser';
import router from './routes.js';
import cors from 'koa2-cors';

// post ctx.request.fields get ctx.query
const app = new Koa();
app.use(bodyParser());

app.use(cors());
app.use(source('./static'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
