import pg from "pg";
import pgConfig from "./pgConfig";
// pgPool connection session

export type FieldType = {
  [key: string]: any;
};

export enum Symbol {
  eq,
  in,
  like,
  between,
  lt,
  gt,
  lteq,
  gteq,
  noteq,
  notin,
}
export type QueryType = {
  key: string;
  symbol: Symbol;
  value: any;
};

// 组装查询条件, 返回代号($x)
// @param field 查询字段
// @param value 查询字段值
// @param qts  提交的查询条件
// @param cnt  组装的代号
// @param number 组装的代号($x)
function getQuery(
  field: any[],
  value: any[],
  qts: QueryType[],
  cnt?: number
): number {
  if (!qts) {
    return 0;
  }

  let count = typeof cnt !== "undefined" ? cnt : 0;

  if (qts && qts.length > 0) {
    var symbol = " = ";
    var tmpValue: any;
    for (const qt of qts) {
      if (qt.key && qt.key.length > 0 && qt.value) {
        count++;

        switch (qt.symbol) {
          case Symbol.eq: {
            symbol = " = $" + count;
            tmpValue = qt.value;
          }
          case Symbol.in: {
            symbol = " in ( $" + count + " )";
            if (qt.value instanceof Array) {
              tmpValue = qt.value.join(",");
            } else {
              tmpValue = qt.value;
            }
          }
          case Symbol.like: {
            symbol = " like %$" + count + "%";
            tmpValue = qt.value;
          }
          case Symbol.between: {
            symbol = " between ( $" + count + ")";
            if (qt.value instanceof Array) {
              tmpValue = qt.value.join(",");
            } else {
              tmpValue = qt.value;
            }
          }
          case Symbol.lt: {
            symbol = " < $" + count;
            tmpValue = qt.value;
          }
          case Symbol.gt: {
            symbol = " > $" + count;
            tmpValue = qt.value;
          }
          default:
            break;
        }

        field.push(qt.key + symbol);
        value.push(tmpValue);
      }
    }
  }

  return count;
}

// pg session
class PgSession {
  private conn: pg.PoolClient;
  private trans = false;

  constructor(conn: pg.PoolClient) {
    this.conn = conn;
  }

  async begin(): Promise<void> {
    await this.conn.query("begin");
    this.trans = true;
  }

  async commit(): Promise<void> {
    await this.conn.query("commit");
    this.trans = false;
  }

  async savepoint(id: string): Promise<void> {
    await this.conn.query("savepoint $1", [id]);
  }

  async rollback(savepoint?: string): Promise<void> {
    if (savepoint) {
      await this.conn.query("rollback to savepoint $1", [savepoint]);
    } else {
      await this.conn.query("rollback");
      this.trans = false;
    }
  }
  async queryList(sql: string, ...parameters: any[]): Promise<any[]> {
    const result = await this.conn.query(sql, parameters);
    if (!result || !(result.rows instanceof Array)) {
      return [];
    }
    return result.rows;
  }
  async queryFirst(sql: string, ...parameters: any[]): Promise<any> {
    const result = await this.conn.query(sql, parameters);
    if (result && result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }
  async queryValue(sql: string, ...parameters: any[]): Promise<unknown> {
    const result = await this.conn.query(sql, parameters);
    if (result && result.rowCount > 0) {
      const key = result.fields[0].name;
      return result.rows[0][key];
    } else {
      return null;
    }
  }
  async query(sql: string, ...parameters: any[]): Promise<pg.QueryResult<any>> {
    return await this.conn.query(sql, parameters);
  }

  close() {
    if (this.trans) {
      this.rollback();
    }
    this.conn.release();
  }
}

// pg db
class PgDB {
  private pool: pg.Pool;

  constructor(pool: pg.Pool) {
    this.pool = pool;
  }

  // 返回session
  async connect(): Promise<PgSession> {
    const conn = await this.pool.connect();
    return new PgSession(conn);
  }

  async doTrans(
    callback: (session: PgSession) => Promise<unknown>
  ): Promise<unknown> {
    const session = await this.connect();
    try {
      await session.begin();
      const result = await callback(session);
      await session.commit();
      return result;
    } catch (e) {
      await session.rollback();
      console.error("PgDB.doTrans() error, rollback:", e);
      throw e;
    } finally {
      session.close();
    }
  }

  async run(
    callback: (session: PgSession) => Promise<unknown>
  ): Promise<unknown> {
    const session = await this.connect();
    try {
      return await callback(session);
    } catch (e) {
      console.error("DB.execute() error:", e);
      throw e;
    } finally {
      session.close();
    }
  }

  async queryList(sql: string, ...parameters: any[]): Promise<any[]> {
    const result = await this.pool.query(sql, parameters);
    if (!result || !(result.rows instanceof Array)) {
      return [];
    }
    return result.rows;
  }

  async queryFirst(sql: string, ...parameters: any[]): Promise<any> {
    const result = await this.pool.query(sql, parameters);
    if (result && result.rowCount > 0) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async queryValue(sql: string, ...parameters: any[]): Promise<unknown> {
    const result = await this.pool.query(sql, parameters);
    if (result && result.rowCount > 0) {
      const key = result.fields[0].name;
      return result.rows[0][key];
    } else {
      return null;
    }
  }

  async query(sql: string, ...parameters: any[]): Promise<pg.QueryResult<any>> {
    return await this.pool.query(sql, parameters);
  }

  async insert(tableName: string, fields: FieldType): Promise<boolean> {
    if (!tableName) {
      return false;
    }
    var sql = "insert into " + tableName;
    var field = [];
    var value = [];
    var num = [];
    var count = 0;
    if (fields) {
      for (var i in fields) {
        count++;
        field.push(i);
        value.push(fields[i]);
        num.push("$" + count);
      }
      sql += "(" + field.join(",") + ") values(" + num.join(",") + ")";
    }
    console.log("/insert sql: ", sql);

    const result = await this.pool.query(sql, value);
    if (result && result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async update(
    tableName: string,
    fields: FieldType,
    queryParams: QueryType[]
  ): Promise<boolean> {
    if (!tableName) {
      return false;
    }
    var sql = "update " + tableName + " set ";
    var field: any[] = [];
    var value = [];
    var count = 0;
    if (fields) {
      for (var i in fields) {
        count++;
        field.push(i + "=$" + count);
        value.push(fields[i]);
      }
      sql += field.join(",");
      field = [];
    }

    if (queryParams) {
      getQuery(field, value, queryParams, count);
      sql += " where " + field.join(" and ");
    }

    console.log("/update sql: ", sql, value);

    const result = await this.pool.query(sql, value);
    if (result && result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async delete(tableName: string, queryParams: QueryType[]): Promise<boolean> {
    if (!tableName) {
      return false;
    }
    var sql = "delete from " + tableName;
    var field: any[] = [];
    var value: any[] = [];
    if (queryParams) {
      getQuery(field, value, queryParams);
      sql += " where " + field.join(" and ");
    }
    console.log("/delete sql: ", sql);

    const result = await this.pool.query(sql, value);
    if (result && result.rowCount > 0) {
      return true;
    } else {
      return false;
    }
  }

  async select(
    tableName: string,
    queryParams: QueryType[],
    returnFields: string[]
  ): Promise<any[]> {
    if (!tableName) {
      return [];
    }
    var field: any[] = [];
    var value: any[] = [];

    var returnStr = "";
    if (returnFields.length == 0) {
      returnStr = "*";
    } else {
      returnStr = returnFields.join(",");
    }

    var sql = "select " + returnStr + " from " + tableName;
    if (queryParams) {
      getQuery(field, value, queryParams);
      sql += " where " + field.join(" and ");
    }
    console.log("/select sql: ", sql);

    const result = await this.pool.query(sql, value);
    if (!result || !(result.rows instanceof Array)) {
      return [];
    }
    return result.rows;
  }
}

// 固定pg DB连接
export const PGDB = new PgDB(pgConfig.pgPool);
export default {
  // 自定义pg DB 连接
  PgDB,
};
