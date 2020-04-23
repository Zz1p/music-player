import mysql from 'mysql';
import co from 'co-mysql';

export default co(mysql.createPool({
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "music_player"
}));

