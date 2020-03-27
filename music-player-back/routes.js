import Router from "koa-router";

const router = new Router();

router.get('/api/list/:index', async ctx => {
    ctx.body = ctx.query;
});

router.post('/login', async ctx => {
    ctx.body = 'login'
});

export default router;