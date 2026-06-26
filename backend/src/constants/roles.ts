export const ROLES = {
  BUYER: 'BUYER',
  SELLER: 'SELLER',
  AGENT: 'AGENT',
  ADMIN: 'ADMIN',
  VERIFIED: 'VERIFIED',
} as const;

export type RoleType = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES);
