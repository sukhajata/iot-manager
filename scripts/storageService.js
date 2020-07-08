import { AsyncStorage } from "react-native";

const USER_TOKEN = "userToken";
const USER_JSON = "userJSON";
const SITE = "site";

export async function getToken() {
  const userToken = await AsyncStorage.getItem(USER_TOKEN);
  return userToken;
}

export async function setToken(token) {
  await AsyncStorage.setItem(USER_TOKEN, token);
}

export async function removeToken() {
  await AsyncStorage.removeItem(USER_TOKEN);
}

export async function getUser() {
  const userJSON = await AsyncStorage.getItem(USER_JSON);
  if (userJSON) {
    return JSON.parse(userJSON);
  }
  return null;
}

export async function syncSites(sites) {
  sites.forEach(async site => {
    const stored = await AsyncStorage.getItem(site.Id.toString());
    AsyncStorage.has;
    if (!stored) {
      await AsyncStorage.setItem(site.Id.toString(), JSON.stringify(site));
    }
  });
}

export async function setUser(user) {
  await AsyncStorage.setItem(USER_JSON, JSON.stringify(user));
}

export async function removeUserJSON() {
  await AsyncStorage.removeItem(USER_JSON);
}

export async function setSite(site) {
  await AsyncStorage.setItem(site.Id.toString(), JSON.stringify(site));
}

export async function getSite(siteId) {
  const data = await AsyncStorage.getItem(siteId.toString());
  if (data) {
    return JSON.parse(data);
  }
  return null;
}

export async function removeSite() {
  await AsyncStorage.removeItem(SITE);
}
