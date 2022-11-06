// ----- global config, read .env file-----
// dotenv/config 绑定.env参数到process
import "dotenv/config";
import dotenv from "dotenv";
import fs from "fs";
import pg from "pg";
import sequelizeTs from "sequelize-typescript";

// 通过.env读取配置环境
const env = process.env.NODE_ENV;
// model存放目录
const models_path = __dirname.replace("config", "model") + "/**/*.ts";
console.log(models_path);

// 获取制定xxx.env的配置参数
export const Config = dotenv.parse(fs.readFileSync(`${env}.env`));

const PG: pg.PoolConfig = {
  host: Config.pg_host,
  database: Config.pg_database,
  user: Config.pg_user,
  password: Config.pg_password,
  port: Number(Config.pg_port),
  max: Number(Config.pg_max),
  min: Number(Config.pg_min),
  idleTimeoutMillis: Number(Config.pg_idle_timeout_millis),
};

const PG_Sequelize: sequelizeTs.SequelizeOptions = {
  host: Config.pg_host,
  database: Config.pg_database,
  dialect: "postgres",
  username: Config.pg_user,
  password: Config.pg_password,
  port: Number(Config.pg_port),
  define: {
    timestamps: true, //开启时间戳 create_at delete_at update_at
    paranoid: true, //开启假删除
    underscored: true, //下划线
    charset: "utf8",
    freezeTableName: true, //固定表名为单数  默认表名是xxxs
  },
  pool: {
    max: Number(Config.pg_max),
    min: Number(Config.pg_min),
    acquire: 30000,
    idle: 10000,
  },
  timezone: "+08:00",
  models: [models_path],
  logging: (...msg) => console.log(msg),
};

export const CONFIG = {
  // 端口
  SERVER_PORT: Config.SERVER_PORT || process.env.SERVER_PORT,
  // pg连接
  PG: PG,
  PG_URL: Config.pg_url,
  // pg sequelize
  PG_Sequelize: PG_Sequelize,
};
