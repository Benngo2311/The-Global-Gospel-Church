import Database from 'better-sqlite3';
const db = new Database('church.db');
const prayers = db.prepare('SELECT * FROM prayers').all();
console.log("SQLite Prayers:", prayers);
