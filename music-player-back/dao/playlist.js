const insertPLayListDao = async (params, db) => {
  const sql = 'insert into playlist (`name`, `picUrl`, `songs`) values(?,?,?)';
  return await db.query(sql, [params.name, params.picUrl, params.songs]);
};

export {
  insertPLayListDao
}
