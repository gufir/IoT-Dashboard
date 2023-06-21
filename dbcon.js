const mysql = require('mysql');
const db = mysql.createConnection({
    host: '192.168.43.192',
    port: '3306',
    user: 'remoteuser',
    password: 'remote',
    database: 'dht22db'
});

db.connect( (err) => {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
    console.log('connected to mysql');
  });

module.exports = db