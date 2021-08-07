import { UseBefore } from "@tsed/common";
import { useDecorators, StoreSet } from "@tsed/core";
import { AcceptRolesMiddleware } from "../middlewares/AcceptRoleMiddleware";

export function AcceptRoles(...roles: string[]) {
  return useDecorators(
    UseBefore(AcceptRolesMiddleware),
    StoreSet(AcceptRolesMiddleware, roles)
  );
}
