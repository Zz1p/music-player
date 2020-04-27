import utils from "../web/utils";

const insertPlaylistDao = async (params, db) => {
  const sql = 'insert into playlist (`name`, `picUrl`, `songs`) values(?,?,?)';
  return await db.query(sql, [params.name, params.picUrl, params.songs]);
};

const updatePlaylistDao = async (params, db) => {
  const selectSql = 'select * from playlist where id = ?';
  const result = await db.query(selectSql, [params.id]);
  let songs = result[0].songs.length ? JSON.parse(result[0].songs) : [];
  songs = params.t === '1' ? utils.addItem2Arr(songs, params.songs) : utils.deleteItem2Arr(songs, params.songs);
  const updateSql = 'update playlist set songs = ? where id = ?';
  return await db.query(updateSql, [JSON.stringify(songs), params.id])
};

// params: id
const deletePlayListDao = async (params, db) => {
  const sql = 'delete from playlist where id = ?';
  return await db.query(sql, [params])
};

// params: id
const playListDao = async (params, db) => {
const sql = params ? 'select * from playlist where id = ?' : 'select * from playlist';
return await db.query(sql, [params])
};


export {
  insertPlaylistDao,
  updatePlaylistDao,
  deletePlayListDao,
  playListDao
}
