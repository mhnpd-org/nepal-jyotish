import type { AppUser } from './types';

export const isSuperAdmin = (userDoc: AppUser | null | undefined) => userDoc?.role === 'super_admin';
export const isAstrologer = (userDoc: AppUser | null | undefined) => userDoc?.role === 'astrologer';
export const isNormalUser = (userDoc: AppUser | null | undefined) => userDoc?.role === 'user';
