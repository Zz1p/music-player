const insertPosterDao = async (params, db) => {
  const sql = 'insert into poster (`name`, `picUrl`, `songId`) values (?,?,?)';
  db.query(sql, [params.name, params.picUrl, params.songId]);
};

const getPostersDao = async (params, db) => {
  const sql = 'select * from poster';
  return await db.query(sql, [params.username, params.password]);
};

// params: id
const deletePosterDao = async (params, db) => {
  const sql = 'delete from poster where id = ?';
  return await db.query(sql, [params])
};


export {
  insertPosterDao,
  getPostersDao,
  deletePosterDao
}
