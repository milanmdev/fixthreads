import { IgApiClient } from "instagram-private-api";
import users from "../../../config/users.json";

let tokenStore = {
  token: "",
  timestamp: 0,
  username: "",
};
let failedCredentials: string[] = [];

async function runIgLogin() {
  if (!users.length) return false;
  let filteredArray = users.filter(
    (user) => !failedCredentials.includes(user.username)
  );
  let trialUser = filteredArray[0];

  try {
    const ig = new IgApiClient();
    ig.state.generateDevice(trialUser.username);
    await ig.simulate.preLoginFlow();
    await ig.account.login(trialUser.username, trialUser.password);
    if (ig.state && (ig.state as any).authorization) {
      tokenStore = {
        token: (ig.state as any).authorization,
        timestamp: Date.now(),
        username: trialUser.username,
      };
      return tokenStore;
    } else {
      failedCredentials.push(trialUser.username);
      return false;
    }
  } catch (e) {
    return false;
  }
}

async function login(retrieveOnly: boolean = false) {
  if (retrieveOnly) {
    if (tokenStore.token.length == 0) return false;
    return tokenStore;
  }

  if (tokenStore.token) {
    return tokenStore;
  } else {
    let runLogin = await runIgLogin();
    if (runLogin == false) {
      if (failedCredentials.length == users.length) {
        return false;
      } else {
        return await login();
      }
    } else {
      return runLogin;
    }
  }
}

async function refreshToken() {
  tokenStore = {
    token: "",
    timestamp: 0,
    username: "",
  };

  return await login();
}

export { login, refreshToken };
