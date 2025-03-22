import { IgApiClient } from "instagram-private-api";
import users from "../../../config/users.json";
import fs from "node:fs";
import { ThreadsAPI } from "threads-api";

let tokenStore = {
  token: "",
  timestamp: 0,
  username: "",
};
let failedCredentials: string[] = [];
let runningLogin = false;
let hasReadTokenFile = false;

function readTokenFile() {
  let tokenFile = fs.readFileSync(
    __dirname + "/../../../generated/token.json",
    "utf-8"
  );
  let tokenFileJson = JSON.parse(tokenFile);
  tokenStore = tokenFileJson;
}

function writeTokenFile() {
  fs.writeFileSync(
    __dirname + "/../../../generated/token.json",
    JSON.stringify(tokenStore)
  );
}

/*async function runIgLogin() {
  if (runningLogin) return false;
  if (!users.length) return false;
  let filteredArray = users.filter(
    (user) => !failedCredentials.includes(user.username)
  );
  let trialUser = filteredArray[0];

  try {
    runningLogin = true;
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
      runningLogin = false;
      writeTokenFile();
      return tokenStore;
    } else {
      failedCredentials.push(trialUser.username);
      return false;
    }
  } catch (e) {
    return false;
  }
}*/
async function runIgLogin() {
  if (runningLogin) return false;
  if (!users.length) return false;
  let filteredArray = users.filter(
    (user) => !failedCredentials.includes(user.username)
  );
  let trialUser = filteredArray[0];

  try {
    runningLogin = true;
    const threads = new ThreadsAPI({
      username: trialUser.username,
      password: trialUser.password,
      deviceID: trialUser.deviceId || undefined,
    });
    await threads.login();
    if (!threads.token) {
      failedCredentials.push(trialUser.username);
      return false;
    }

    tokenStore = {
      token: "Bearer IGT:2:" + threads.token,
      timestamp: Date.now(),
      username: trialUser.username,
    };
    runningLogin = false;
    writeTokenFile();
    return tokenStore;
  } catch (e) {
    console.error(e);
    return false;
  }
}

async function login(retrieveOnly: boolean = false) {
  if (!hasReadTokenFile) {
    readTokenFile();
    hasReadTokenFile = true;
  }

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
  writeTokenFile();

  return await login();
}

export { login, refreshToken };
