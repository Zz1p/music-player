import Koa from 'koa';
import Router from 'koa-router';
import source from 'koa-static';
import bodyParser from 'koa-bodyparser';
// post ctx.reqyest.fields get ctx.query
const app = new Koa();
app.use(bodyParser());
const router = new Router();
const list = new Router({
    prefix: '/list'
});

list.get('/:index', async ctx => {
    ctx.body = ctx.params.index;
});

router.post('/login', async ctx => {
    ctx.body = 'login'
});


app.use(source('./static'));
app.use(list.routes());
app.use(router.routes());
app.listen(3000);
