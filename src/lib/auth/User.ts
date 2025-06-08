import types from "@supabase/supabase-js";
import { HierarchicalRole, isHierarchical, Role, ROLE_LEVELS } from "./Role";

export type SerializedUser = {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  roleLevel: number;
  authUser: types.User;
  profile: Profile;
};

export type Profile = {
  id: string;
  name: string;
  role: Role;
  role_level: number | null;
};

export class User {
  id: string;
  email: string | null;
  name: string;
  role: Role;
  roleLevel: number;
  authUser: types.User;
  profile: Profile;

  constructor(raw: SerializedUser) {
    this.id = raw.id;
    this.email = raw.email ?? null;

    this.name = raw.name;
    this.role = raw.role as Role;
    this.roleLevel = raw.roleLevel ?? 0;

    this.authUser = raw.authUser;
    this.profile = raw.profile;
  }

  static from(authUser: types.User, profile: Profile): User {
    const role = profile.role ?? "authenticated";
    const roleLevel = profile.role_level ?? ROLE_LEVELS[role] ?? 0;
    return new User({
      id: authUser.id,
      email: authUser.email ?? null,
      name: profile.name,
      role: role,
      roleLevel: roleLevel,
      authUser,
      profile,
    });
  }

  hasMinimumRole(required: HierarchicalRole): boolean {
    return isHierarchical(this.role) && ROLE_LEVELS[this.role] >= ROLE_LEVELS[required];
  }

  toJSON(): SerializedUser {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      roleLevel: this.roleLevel,
      authUser: this.authUser,
      profile: this.profile,
    };
  }

  is(role: Role): boolean {
    return this.role === role;
  }

  isOneOf(roles: Role[]): boolean {
    return roles.includes(this.role);
  }
}
