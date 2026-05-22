import { STORAGE_KEYS, StorageKey } from ".";
import { UserAuthenticationResponseData } from "../../api/user";

export const saveUserData = (authResponse: UserAuthenticationResponseData) => {
    localStorage.setItem(STORAGE_KEYS[StorageKey.USER_DATA], JSON.stringify(authResponse));
};

export const getUserData = (): UserAuthenticationResponseData | null => {
    const userData = localStorage.getItem(STORAGE_KEYS[StorageKey.USER_DATA]);
    return userData ? JSON.parse(userData) : null;
};

export const getTokens = () => {
    const user = getUserData();
    return user ? user.access_token : null;
};

export const cleanAllStorage = () => {
    localStorage.removeItem(STORAGE_KEYS[StorageKey.USER_DATA]);
};
