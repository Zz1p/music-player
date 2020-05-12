const getSongsDao = async (db) => {
  const sql = `select * from song`;
  return await db.query(sql);
};

const getSongsByIdDao = async (params, db) => {
  const sql = `select * from song where id in (${params.id})`;
  console.log('db', db);
  return await db.query(sql);
};

const insertSongDao = async (params, db) => {
  const sql = 'insert into song (`name`,`filename`, `url`, `author`, `picUrl`) values (?,?,?,?, ?)';
  return await db.query(sql, [params.name, params.filename, params.url, params.author, params.picUrl]);
};

const deleteSongDao = async (params, db) => {
    const sql = 'delete from song where id = ?';
    return await db.query(sql, [params])
};

const getSongByNameDao = async (params, db) => {
  const sql = `select * from song where name like '%${params}%'`;
  return await db.query(sql);
};

export {
  getSongsDao,
  getSongsByIdDao,
  insertSongDao,
  deleteSongDao,
  getSongByNameDao
}
