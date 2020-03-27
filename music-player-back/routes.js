import Router from "koa-router";

const router = new Router();

router.get('/api/list', async ctx => {
    ctx.body = ctx.query;
});

router.post('/api/login', async ctx => {
    ctx.body = 'login'
});

export default router;