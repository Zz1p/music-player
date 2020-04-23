import Router from "koa-router";
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'koa2-cors';
import koaJwt from 'koa-jwt';
import collection from './playlist';
import routerLoader from './routerLoader.js';
import db from './dao/dbutil';


const app = new Koa();
const router = new Router();
const jwtSecret = 'music_player_token';

app.context.db = db;
app.use(bodyParser());
app.use(koaJwt({
    secret: jwtSecret,
    passthrough: true
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

routerLoader(router);

router.get('/api/list', async ctx => {
    ctx.body = ctx.query;
});



router.get('/api/user/collection',
    async ctx => {
    const userId = ctx.request.query.userId;    ctx.body = collection;
    console.log('userId line47', userId)
});

export {
    router,
    app
};

// https://www.jianshu.com/p/794ba23e68ad
