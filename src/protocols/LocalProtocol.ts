import { BodyParams, Constant, Inject, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { OnVerify, Protocol } from "@tsed/passport";
import * as jwt from "jsonwebtoken";
import { IStrategyOptions, Strategy } from "passport-local";
import { User } from "../models/users/User";
import { UsersService } from "../services/UsersService";

@Protocol<IStrategyOptions>({
  name: "local",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password",
  },
})
export class LocalProtocol implements OnVerify {
  @Inject()
  usersService: UsersService;

  @Constant("passport.protocols.jwt.settings")
  jwtSettings: any;

  async $onVerify(@Req() request: Req, @BodyParams() credentials: User) {
    const { email, password } = credentials;

    const user = await this.usersService.findOne({ email });
    if (!user) {
      throw new Unauthorized("Wrong credentials");
    }
    const passwordMatched = await user.verifyPassword(password);
    if (!passwordMatched) {
      throw new Unauthorized("Wrong credentials");
    }

    const token = this.createJwt(user);

    this.usersService.attachToken(user, token);
    //     const response = {
    //       token,
    //     };
    //     console.log(response);
    return { token: user.token };
  }

  createJwt(user: User) {
    const { issuer, audience, secretOrKey, maxAge = 3600 } = this.jwtSettings;
    const now = Date.now();

    return jwt.sign(
      {
        iss: issuer,
        aud: audience,
        sub: user._id,
        exp: now + maxAge * 1000,
        iat: now,
      },
      secretOrKey
    );
  }
}
