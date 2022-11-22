import {
  Controller,
  Autowired,
  Post,
  Get,
  RequestBody,
  PathVariable,
  Response,
  TResponse,
  UseBefore,
  Description,
  RequestParam,
} from "lenneth-v2";
import { UserService, UserServiceImpl } from "../service/userService";
import User, { QueryType, UserType } from "../model/user";

// const userService: UserService = new UserServiceImpl();
@Controller("/user")
export class UserController {
  @Autowired()
  userService: UserServiceImpl = new UserServiceImpl();

  @Get("/page")
  @Description("分页")
  async page(
    @RequestParam("userId") userId: string,
    @Response() response: TResponse
  ) {
    const params: QueryType = { userId: userId };
    response.body = await this.userService.page(params);
  }

  @Get("/detail/:id")
  // @UseBefore(UserAuth)
  @Description("查询")
  async detail(
    @PathVariable("id") id: string,
    @Response() response: TResponse
  ) {
    const qt: QueryType = {
      id: ~~id,
    };
    response.body = await this.userService.findUserId(qt);
  }

  @Post("/add")
  @Description("添加")
  async add(@RequestBody() user: User, @Response() response: TResponse) {
    response.body = await this.userService.create(user);
  }

  @Post("/update/:id")
  @Description("更新")
  async update(
    @PathVariable("id") id: string,
    @RequestBody() user: User,
    @Response() response: TResponse
  ) {
    console.log("user: ", user);

    response.body = await this.userService.update(id, user);
  }
}
