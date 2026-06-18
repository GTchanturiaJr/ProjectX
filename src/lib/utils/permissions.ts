import { ROLE_PERMISSIONS, type Role, type PermissionName } from '../types';

export function hasPermission(roles: Role[], permission: PermissionName): boolean {
  return roles.some(role => ROLE_PERMISSIONS[role]?.includes(permission));
}

export function hasAnyPermission(roles: Role[], permissions: PermissionName[]): boolean {
  return permissions.some(p => hasPermission(roles, p));
}

export function isRoleAllowed(requiredRole: Role, userRoles: Role[]): boolean {
  const roleHierarchy: Role[] = ['super_admin', 'admin', 'editor', 'seo_manager', 'media_manager', 'viewer', 'customer'];
  return userRoles.some(ur => roleHierarchy.indexOf(ur) <= roleHierarchy.indexOf(requiredRole));
}
