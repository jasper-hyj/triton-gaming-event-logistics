export type Role = "tg_admin" | "tg_elo" | "tg_officer" | "tg_division" | "authenticated";

export const ROLE_LEVELS: Record<Role, number> = {
  tg_admin: 4,
  tg_elo: 3,
  tg_officer: 2,
  tg_division: 1,
  authenticated: 0,
};
export type HierarchicalRole = keyof typeof ROLE_LEVELS;

export function isHierarchical(role: Role): role is HierarchicalRole {
  return !!role && role in ROLE_LEVELS;
}
