import fs from 'fs';
const files = fs.readdirSync('web')
let pathMap = new Map();

export default router => {
  for (let i of files) {
    let temp = require('./web/' + i);
    if (temp.path) {
      for (let [key, value] of temp.path) {
        if (pathMap.get(key) === undefined) {
          pathMap.set(key, value);
          value[1] = value[1] === undefined ? 'get' : value[1];
          router[value[1]](key, value[0])
        } else {
          throw new Error("url：" + key + "异常！")
        }
      }
    }
  }
};

