import Koa from 'koa';
import source from 'koa-static';
import bodyParser from 'koa-bodyparser';
import router from './routes.js';
import cors from 'koa2-cors';
import jwt from 'koa-jwt';

const app = new Koa();
// post ctx.request.fields get ctx.query

app.use(bodyParser());
app.use(jwt({
    secret: 'music_player_token'
}).unless({
    path: [/\/login/]
}));
app.use((ctx, next) => {
    return next().catch((err) => {
        if (err.status === 401) {
            ctx.status = 401;
            ctx.body = {
                ok: false,
                msg: err.originalError ? err.originalError.message : err.message
            }
        } else {
            throw err;
        }
    });
});
app.use(cors());
app.use(source('./static'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
