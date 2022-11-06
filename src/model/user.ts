//http://t.zoukankan.com/lifefriend-p-10025469.html
import {
  Table,
  Column,
  Model,
  CreatedAt,
  UpdatedAt,
  DataType,
  DeletedAt,
} from "sequelize-typescript";
import { Op, Order, OrderItem } from "sequelize";

// https://blog.csdn.net/DanielJackZ/article/details/94059798 >> 漏洞
@Table({
  tableName: "t_user_1",
  timestamps: false, // false 可以释放@xxxAt的注解
  // updatedAt: "updateTimestamp", // 想要 updatedAt 但是希望名称叫做 updateTimestamp
  // createdAt: false,  // 不想要 createdAt
})
export default class User extends Model {
  @Column({
    comment: "id",
    field: "id",
    primaryKey: true,
    autoIncrement: true, // 需要pg的id自增
  })
  id?: number;

  @Column({
    field: "user_id",
  })
  userId?: string;

  @Column({
    field: "real_name",
  })
  realName?: string;

  @Column({
    field: "account",
  })
  account?: string;

  @Column({
    field: "sex",
  })
  sex?: string;

  @Column({
    field: "super_admin_flag",
    defaultValue: "N",
  })
  superAdminFlag?: string;

  @Column({
    field: "status_flag",
    defaultValue: 1,
  })
  statusFlag?: number;

  @Column({
    field: "create_time",
    defaultValue: DataType.NOW,
  })
  @CreatedAt
  createTime?: Date;

  @Column({
    field: "update_time",
    defaultValue: DataType.NOW,
  })
  @UpdatedAt
  updateTime?: Date;

  @Column({
    field: "del_flag",
    defaultValue: "N",
  })
  @DeletedAt // 这个注解是必须的, 继承了Model
  delFlag?: string;
}

// 创建, 更新
export type UserType = {
  id?: number;

  userId?: string;

  realName?: string;

  account?: string;

  sex?: string;

  superAdminFlag?: string;

  statusFlag?: number;

  delFlag?: string;

  createTime?: Date;

  updateTime?: Date;
};

// 查询
export type QueryType = {
  id?: number;

  userId?: string;

  realName?: string;

  account?: string;

  sex?: string;

  superAdminFlag?: string;

  statusFlag?: number;

  delFlag?: string;

  startTime?: Date;

  endTime?: Date;

  // 多级条件用','隔开, 升/降序用' '隔开
  order?: string; // ep: id desc, create_time desc

  // 页数量
  pageSize?: number;
  // 当前页码
  pageNum?: number;
  // 返回字段
  attributes?: string[];
};

// 查询类型
export type OptionsType = {
  readonly where: {
    id?: {};
    userId?: {};
    realName?: {};
    account?: {};
    sex?: {};
    superAdminFlag?: {};
    statusFlag?: {};
    delFlag?: {};
    createTime?: {};
  };
  order?: Order;
  offset?: number;
  limit?: number;
  attributes?: string[];
};

export function query(params: QueryType): OptionsType {
  let options: OptionsType = {
    where: {},
  };
  const likeParam = (param: string): string => {
    return "%" + param + "%";
  };
  if (params) {
    if (params.id) {
      options.where.id = { [Op.eq]: params.id };
    }
    if (params.userId) {
      options.where.userId = { [Op.like]: likeParam(params.userId) };
    }
    if (params.realName) {
      options.where.realName = { [Op.like]: likeParam(params.realName) };
    }
    if (params.account) {
      options.where.account = { [Op.like]: likeParam(params.account) };
    }
    if (params.sex) {
      options.where.sex = { [Op.eq]: params.sex };
    }
    if (params.superAdminFlag) {
      options.where.superAdminFlag = { [Op.eq]: params.superAdminFlag };
    }
    if (params.statusFlag) {
      options.where.statusFlag = { [Op.eq]: params.statusFlag };
    }
    if (params.delFlag) {
      options.where.delFlag = { [Op.eq]: params.delFlag };
    } else {
      // 默认查询N
      options.where.delFlag = { [Op.eq]: "N" };
    }
    if (params.startTime) {
      options.where.createTime = { [Op.gte]: params.startTime };
    }
    if (params.endTime) {
      options.where.createTime = { [Op.lte]: params.endTime };
    }
    if (params.startTime && params.endTime) {
      options.where.createTime = {
        [Op.between]: [params.startTime, params.endTime],
      };
    }
    if (params.order) {
      let bys: any[] = [];
      params.order.split(",").forEach((by) => {
        bys.push([by.split(" ")]);
      });
      options.order = bys;
    } else {
      options.order = [["create_time", "DESC"]];
    }

    if (params.pageSize && params.pageNum) {
      if (params.pageNum > 0 && params.pageSize > 0) {
        options.offset = (params.pageNum - 1) * params.pageSize;
        options.limit = params.pageSize;
      } else {
        options.offset = 0;
        options.limit = 10;
      }
    }

    if (params.attributes && params.attributes.length > 0) {
      options.attributes = params.attributes;
    }
  }
  return options;
}
