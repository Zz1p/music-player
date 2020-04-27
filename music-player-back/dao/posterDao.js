const insertPosterDao = async (params, db) => {
  const sql = 'insert into poster (`name`, `songId`) values (?,?)';
  db.query(sql, [params.name, params.songId]);
};

const getPostersDao = async (params, db) => {
  const sql = 'select * from poster';
  return await db.query(sql);
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
