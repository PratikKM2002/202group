import Cookies from 'js-cookie';
import { SocialUser, TokenPayload } from '../types/auth';

const TOKEN_COOKIE = 'auth_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const setAuthCookies = (payload: TokenPayload) => {
  Cookies.set(REFRESH_TOKEN_COOKIE, payload.refreshToken, {
    expires: 7,
    secure: true,
    sameSite: 'strict'
  });
};

export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(REFRESH_TOKEN_COOKIE);
};

export const getRefreshToken = (): string | undefined => {
  return Cookies.get(REFRESH_TOKEN_COOKIE);
};