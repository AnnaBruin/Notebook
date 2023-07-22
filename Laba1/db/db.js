import * as SQLite from 'expo-sqlite';
import FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';

const DB_NAME = 'SQlite';
const TABLE_NAME = 'notes';

class Database {
  _db;

  constructor() {
    this._db = SQLite.openDatabase(DB_NAME);
    this._db.transaction(tx => {
      tx.executeSql(`
        CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
          id INTEGER PRIMARY KEY,
          name TEXT,
          note TEXT NOT NULL,
          created INTEGER NOT NULL,
          updated INTEGET NOT NULL
        )`
      )
    });
  }

  async getAll() { return new Promise((resolve, reject) => {
    this._db.transaction((t) => {
      t.executeSql(
          `SELECT * FROM ${TABLE_NAME}`,
          [],
          (tObj, result) => {resolve(result.rows._array )},
          (tObj, err) => { console.error(err); reject(err); return false },
      )
    })
  })}

  async get(id) { return new Promise((resolve, reject) => {
    this._db.transaction((t) => {
      t.executeSql(
          `SELECT * FROM ${TABLE_NAME} WHERE id=${id}`,
          [],
          (tObj, result) => {resolve(result.rows._array.pop() )},
          (tObj, err) => { console.error(err); reject(err); return false },
      )
    })
  })}

  async add(item) { return new Promise((resolve, reject) => {
    this._db.transaction((t) => {
      const { note, name } = item;
      const created = Date.now();
      t.executeSql(
          `INSERT INTO ${TABLE_NAME} 
            (name, note, created, updated) 
            VALUES ('${name}', '${note}', ${created}, ${created})`,
          [],
          (tObj, result) => resolve(result.insertId),
          (tObj, err) => { reject(err.message); return false },
      )
    })
  })}

  async delete(id) { return new Promise((resolve, reject) => {
    this._db.transaction((t) => {
      t.executeSql(
          `DELETE FROM ${TABLE_NAME} WHERE id = ${id}`,
          [],
          (tObj, result) => resolve(true),
          (tObj, err) => { reject(err); return false },
      )
    })
  })}

  async update(item) { return new Promise((resolve, reject) => {
    const { id, name, note } = item;
    this._db.transaction((t) => {
      t.executeSql(
          `UPDATE ${TABLE_NAME}
            SET name = '${name}', note = '${note}', updated = ${Date.now()} 
            WHERE id = ${id}`,
          [],
          (tObj, result) => resolve(true),
          (tObj, err) => { reject(err); return false },
      )
    })
  })}

}

export const DB = new Database();