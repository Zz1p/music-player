import Router from "koa-router";

const router = new Router();

router.get('/api/list', async ctx => {
    ctx.body = ctx.query;
});

router.post('/api/login', async ctx => {
    ctx.body = {
        validUser: true,
        token: jwt.sign({username: ctx.request.fields.username, password: ctx.request.fields.password}, )
    }
});
export default router;