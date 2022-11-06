import { UserDao, UserDaoImpl } from "../dao/userDao";
import User, { QueryType, UserType } from "../model/user";

export interface UserService {
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
  findById(id: number | string): Promise<User | null>;

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
  update(
    id: number | string,
    entity: UserType
  ): Promise<[count: number, rows: User[]]>;

  /**
   * @name: 删除
   * @param : id
   * @return : count
   */
  delete(id: number | string): Promise<number>;
}

export class UserServiceImpl implements UserService {
  private userDao: UserDao;

  constructor() {
    this.userDao = new UserDaoImpl();
  }

  /**
   * @name: 查询
   * @param : params
   * @return : User[]
   */
  public findAll(params: QueryType) {
    return this.userDao.findAll(params);
  }

  /**
   * @name: 分页查询
   * @param : params
   * @return : User[]
   */
  public page(params: QueryType) {
    return this.userDao.page(params);
  }

  /**
   * @name: id查询
   * @param : id
   * @return : User
   */
  public findById(id: number | string) {
    return this.userDao.findById(~~id);
  }

  /**
   * @name: 查询用户id
   * @param : params
   * @return : User[]
   */
  public findUserId(params: QueryType) {
    return this.userDao.findUserId(params);
  }

  /**
   * @name: 新增
   * @param : entity
   * @return : User
   */
  public create(entity: UserType) {
    return this.userDao.create(entity);
  }

  /**
   * @name: 更新
   * @param : id
   * @param : entity
   * @return : [count, User]
   */
  public update(id: number | string, entity: UserType) {
    return this.userDao.update(~~id, entity);
  }

  /**
   * @name: 删除
   * @param : id
   * @return : count
   */
  public delete(id: number | string) {
    return this.userDao.delete(~~id);
  }
}
