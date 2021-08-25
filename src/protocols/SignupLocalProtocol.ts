import {BodyParams} from "@tsed/common";
import {OnInstall, OnVerify, Protocol} from "@tsed/passport";
import {Strategy} from "passport-local";
import {Forbidden} from "@tsed/exceptions";
import {UsersService} from "../services/UsersService";
import {User} from "../models/users/User";
import {Groups} from "@tsed/schema";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@BodyParams() @Groups("creation") user: User) {
    const {email} = user;
    const found = await this.usersService.findOne({email});

    if (found) {
      throw new Forbidden("Email is already registered");
    }

    return this.usersService.save(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
