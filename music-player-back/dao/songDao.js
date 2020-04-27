const getSongsDao = async (db) => {
  const sql = `select * from song`;
  return await db.query(sql);
};

const getSongsByIdDao = async (params, db) => {
  const sql = `select * from song where id in (${params.id})`;
  return await db.query(sql);
};

const insertSongDao = async (params, db) => {
  const sql = 'insert into song (`name`,`filename`, `url`, `author`, `picUrl`) values (?,?,?,?, ?)';
  return await db.query(sql, [params.name, params.filename, params.url, params.author, params.picUrl]);
};

export {
  getSongsDao,
  getSongsByIdDao,
  insertSongDao
}
