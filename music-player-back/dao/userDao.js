const getUserDao = async (params, db) => {
  const sql = 'select * from user where username = ? and password = ?';
  return await db.query(sql, [params.username, params.password]);
};

const insertUserDao = async (params, db) => {
  const sql = 'insert into user (`username`, `password`, `role`) values (?,?,?)';
  return await db.query(sql, [params.username, params.password, params.role]);
};

const getUserByUsernameDao = async (params, db) =>  {
  const sql = 'select * from user where username = ?';
  return await db.query(sql, [params]);

};

export {
  getUserDao,
  insertUserDao,
  getUserByUsernameDao
}
