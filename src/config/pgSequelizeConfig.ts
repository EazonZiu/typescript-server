import { Sequelize } from "sequelize-typescript";
import { CONFIG } from "./config";

// Sequelize 是一个基于 promise 的 Node.js ORM, 目前支持 Postgres, MySQL, MariaDB, SQLite 以及 Microsoft SQL Server. 它具有强大的事务支持, 关联关系, 预读和延迟加载,读取复制等功能。

// sequelize-typescript

class PgDataSource {
  private sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(CONFIG.PG_Sequelize);
    // this.sequelize.sync(); // 如果表不存在,则创建该表
  }

  static init(): PgDataSource {
    return new PgDataSource();
  }

  getSequelize(): Sequelize {
    return this.sequelize;
  }

  isInit(): Boolean {
    return !!this.sequelize;
  }
}

export const PG_CONTEXT = PgDataSource.init();
export default { PgDataSource };
