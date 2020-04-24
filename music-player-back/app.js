import source from 'koa-static'
import {router, app} from './routes.js'

// post ctx.request.body get ctx.query


app.use(source('./static'));
app.use(router.routes()).use(router.allowedMethods());
app.listen(3000);
