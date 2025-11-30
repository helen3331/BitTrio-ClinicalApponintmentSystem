const ACCESS_TOKEN = "access";
const REFRESH_TOKEN = "refresh";
const ROLE = "role";
const FULL_NAME = "full_name";

export const saveAuth = (data) => {
  localStorage.setItem(ACCESS_TOKEN, data.access);
  localStorage.setItem(REFRESH_TOKEN, data.refresh);
  localStorage.setItem(ROLE, data.role);
  localStorage.setItem(FULL_NAME, data.full_name || "");
};

export const getAccess = () => localStorage.getItem(ACCESS_TOKEN);
export const getRefresh = () => localStorage.getItem(REFRESH_TOKEN);
export const getRole = () => localStorage.getItem(ROLE);
export const getFullName = () => localStorage.getItem(FULL_NAME);

export const clearAuth = () => {
  localStorage.clear();
};

