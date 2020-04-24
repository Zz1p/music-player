import fs from 'fs';
const files = fs.readdirSync('web')
let apiMap = new Map();

export default router => {
  for (let i of files) {
    let temp = require('./web/' + i);
    if (temp.api) {
      for (let [key, value] of temp.api) {
        if (apiMap.get(key) === undefined) {
          apiMap.set(key, value);
          value[1] = value[1] === undefined ? 'get' : value[1];
          router[value[1]](key, value[0])
        } else {
          throw new Error("url：" + key + "异常！")
        }
      }
    }
  }
};

