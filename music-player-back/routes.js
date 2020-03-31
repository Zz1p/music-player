import Router from "koa-router";
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import koaJwt from 'koa-jwt';
import jwt from 'jsonwebtoken';

const app = new Koa();
const router = new Router();
const jwtSecret = 'music_player_token';

app.use(bodyParser());
app.use(koaJwt({
    secret: jwtSecret
}).unless({
    path: [/\/login/]
}));
app.use(cors());
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = 'Protected resource, use Authorization header to get access\n';
        } else {
            throw err;
        }
    });
});
router.get('/api/list', async ctx => {
    ctx.body = ctx.query;
});

router.post('/api/login', async ctx => {
    const token = jwt.verify(ctx.request.headers.authorization, jwtSecret)
    console.log(token);
    const user = ctx.request.body;
    ctx.body = {
        validUser: true,
        username: user.username,
        token: jwt.sign({username: user.username, password: user.password}, jwtSecret)
    }
});

export {
    router,
    app
};

// https://www.jianshu.com/p/794ba23e68ad