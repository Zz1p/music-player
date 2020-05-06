const insertPosterDao = async (params, db) => {
  const sql = 'insert into poster (`name`, `songId`, `songName`) values (?,?,?)';
  return await db.query(sql, [params.name, params.songId, params.songName]);
};

const getPostersDao = async (params, db) => {
  const sql = 'select * from poster';
  return await db.query(sql);
};

// params: id
const deletePosterDao = async (id, db) => {
  const sql = 'delete from poster where id = ?';
  return await db.query(sql, [id])
};


export {
  insertPosterDao,
  getPostersDao,
  deletePosterDao
}
