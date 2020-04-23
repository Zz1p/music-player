export default async (username, password, db) => {
  const sql = 'select * from user where username = ? and password = ?';
  return await db.query(sql, [username, password]);
};
