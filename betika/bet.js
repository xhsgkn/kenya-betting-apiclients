const axios = require("axios");

const headers = {
  accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate",
  "accept-language": "en-US,en;q=0.9",
  connection: "keep-alive",
  "content-type": "application/json;charset=UTF-8",
  host: "api-freebets.betika.com",
  origin: "http://localhost",
  referer: "http://localhost/betslip?type=",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; Google Nexus 7 Build/QQ1D.200105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Safari/537.36",
  "x-requested-with": "com.dmk.betika",
};

function placeBet(betslip, stake, auth) {
  const url = "https://api.betika.com/v2/bet";

  let total_odds = 1.0;
  betslip.forEach((odd) => {
    total_odds *= parseFloat(odd.odd_value);
  });
  total_odds = total_odds.toFixed(2);

  const body = {
    profile_id: auth.user_id,
    stake: stake,
    total_odd: total_odds,
    src: "HYBRID_ANDROID",
    betslip: betslip,
    token: auth.token,
    user_agent: headers["user-agent"],
    app_version: "6.0.0",
    affiliate: null,
    promo_id: null,
    fbpid: false,
    is_freebet: false,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          reject(error.response.data);
        } else if (error.request) {
          reject(error.request);
        } else {
          reject(error.message);
        }
      });
  });
}

function placeFreeBet(betslip, freebet_pid, stake, auth) {
  const url = "https://api.betika.com/v2/bet";

  let total_odds = 1.0;
  betslip.forEach((odd) => {
    total_odds *= parseFloat(odd.odd_value);
  });
  total_odds = total_odds.toFixed(2);

  const body = {
    profile_id: auth.user_id,
    stake: stake,
    total_odd: total_odds,
    src: "HYBRID_ANDROID",
    betslip: betslip,
    token: auth.token,
    user_agent:
      "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
    app_version: "6.0.0",
    affiliate: null,
    promo_id: null,
    fbpid: freebet_pid,
    is_freebet: true,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        if (error.response) {
          reject(error.response.data);
        } else if (error.request) {
          reject(error.request);
        } else {
          reject(error.message);
        }
      });
  });
}

module.exports = {
  placeBet,
  placeFreeBet,
};
