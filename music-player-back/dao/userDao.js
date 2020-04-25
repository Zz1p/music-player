import utils from "../web/utils";

const getUserDao = async (params, db) => {
  const sql = 'select * from user where username = ? and password = ?';
  return await db.query(sql, [params.username, params.password]);
};

const insertUserDao = async (params, db) => {
  const sql = 'insert into user (`username`, `password`, `role`) values (?,?,?)';
  return await db.query(sql, [params.username, params.password, params.role]);
};

const getUserByUsernameDao = async (params, db) => {
  const sql = 'select * from user where username = ?';
  return await db.query(sql, [params]);
};

const userCollectionDao = async (params, db) => {
  const getSql = 'select collection from user where id = ?';
  const result = await db.query(getSql, [params.id]);
  let collection = result[0].collection.length ? JSON.parse(result[0].collection) : [];
  collection = params.t === '1' ? utils.addItem2Arr(collection, params.songId) : utils.deleteItem2Arr(collection, params.songId);
  const updateSql = 'update user set collection = ? where id = ?';
  return await db.query(updateSql, [JSON.stringify(collection), params.id])
};

const getUserCollectionDao = async () => {
  
};

export {
  getUserDao,
  insertUserDao,
  getUserByUsernameDao,
  userCollectionDao
}
