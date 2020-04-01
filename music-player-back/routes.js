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
router.get('/api/list', async ctx => {
    ctx.body = ctx.query;
});

router.post('/api/login', async ctx => {
    const user = ctx.request.body;
    // @todo sql查询用户存在的话获取用户信息生成token 不存在的话返回validUser: false
    ctx.body = {
        validUser: true,
        userInfo: {
            username: user.username,
            token: jwt.sign({username: user.username, password: user.password}, jwtSecret, {expiresIn: 60 * 60 * 24 * 7})
        }
    }
});

router.get('/api/auth', async ctx => {
    const token = ctx.request.headers.authorization.split(' ')[1];
    jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
            ctx.body = {
                validUser: false
            }
        }
        // @todo sql查找用户信息后返回给前端
        console.log(decode);
        ctx.body = {
            userInfo: {
                username: decode.username,
                token
            },
            validUser: true,
        }
    });
});

export {
    router,
    app
};

// https://www.jianshu.com/p/794ba23e68ad