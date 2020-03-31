import source from 'koa-static';
import {router, app} from './routes.js';

// post ctx.request.fields get ctx.query




app.use(source('./static'));
app.use(router.routes());
app.use(router.allowedMethods());
app.listen(3000);
