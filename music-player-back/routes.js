import Router from "koa-router";
import Koa from 'koa';
import cors from 'koa2-cors';
import koaJwt from 'koa-jwt';
import routerLoader from './routerLoader.js';
import db from './dao/dbutil';


const app = new Koa();
const router = new Router();
const jwtSecret = 'music_player_token';

app.context.db = db;
app.use(koaJwt({
    secret: jwtSecret,
    passthrough: true
}).unless({
    path: [/\/login/, /\/register/, /\/playlist/, /\/getPosters/, /\/getSongsById/, /\/song/, /\/getSongByName/]
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

export {
    router,
    app
};

