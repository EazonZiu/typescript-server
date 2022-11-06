import User, { query, QueryType, UserType } from "../model/user";
import { Op } from "sequelize";

/*
 * @Description: 数据库表操作基础接口
 */
export interface UserDao {
  /**
   * @name: 查询
   * @param : params
   * @return : User[]
   */
  findAll(params: QueryType): Promise<User[]>;

  /**
   * @name: 分页查询
   * @param : params
   * @return : User[]
   */
  page(params: QueryType): Promise<object>;

  /**
   * @name: id查询
   * @param : id
   * @return : User
   */
  findById(id: number): Promise<User | null>;

  /**
   * @name: 查询用户id
   * @param : params
   * @return : User[]
   */
  findUserId(params: QueryType): Promise<User[]>;

  /**
   * @name: 新增
   * @param : entity
   * @return : User
   */
  create(entity: UserType): Promise<User>;

  /**
   * @name: 更新
   * @param : id
   * @param : entity
   * @return : [count, User]
   */
  update(id: number, entity: UserType): Promise<[count: number, rows: User[]]>;

  /**
   * @name: 删除
   * @param : id
   * @return : count
   */
  delete(id: number): Promise<number>;
}

export class UserDaoImpl implements UserDao {
  /**
   * @name: 查询
   * @param : params
   * @return : User[]
   */
  public async findAll(params: QueryType): Promise<User[]> {
    return await User.findAll(query(params));
  }

  /**
   * @name: 分页查询
   * @param : params
   * @return : User[]
   */
  public async page(params: QueryType): Promise<object> {
    return await User.findAndCountAll(query(params));
  }

  /**
   * @name: id查询
   * @param : id
   * @return : User
   */
  public async findById(id: number): Promise<User | null> {
    const results = await User.findOne({
      where: {
        id: id,
      },
    });
    return results;
  }

  /**
   * @name: 查询用户id
   * @param : params
   * @return : User[]
   */
  public async findUserId(params: QueryType): Promise<User[]> {
    params.attributes = ["id", "user_id"];
    return await User.findAll(query(params));
  }

  /**
   * @name: 新增
   * @param : entity
   * @return : User
   */
  public async create(entity: UserType): Promise<User> {
    return await User.create(entity);
  }

  /**
   * @name: 更新
   * @param : id
   * @param : entity
   * @return : [count, User]
   */
  public async update(
    id: number,
    entity: UserType
  ): Promise<[count: number, rows: User[]]> {
    const [count, rows] = await User.update(entity, {
      where: {
        id: {
          [Op.eq]: id,
        },
      },
      returning: true,
    });

    return [count, rows];
  }

  /**
   * @name: 删除
   * @param : id
   * @return : count
   */
  public async delete(id: number): Promise<number> {
    return await User.destroy({
      where: {
        id: {
          [Op.eq]: id,
        },
      },
    });
  }
}
