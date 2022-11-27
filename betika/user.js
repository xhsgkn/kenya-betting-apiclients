const axios = require("axios");

const headers = {
  accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate",
  "accept-language": "en-US,en;q=0.9",
  connection: "keep-alive",
  "content-type": "application/json;charset=UTF-8",
  host: "api.betika.com",
  origin: "http://localhost",
  referer: "http://localhost/login?next=%2F",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; Google Nexus 7 Build/QQ1D.200105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Safari/537.36",
  "x-requested-with": "com.dmk.betika",
};

function getAuthToken(phone_number, password) {
  const url = "https://api.betika.com/v1/login";

  const body = {
    mobile: phone_number,
    password: password,
    remember: true,
    src: "HYBRID_ANDROID",
  };

  const auth = {};
  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        auth.user_id = response.data.data.user.id;
        auth.token = response.data.token;
        resolve(auth);
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

function getBalance(auth) {
  const url = "https://api.betika.com/v1/balance";

  const body = {
    token: auth.token,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        if (response.data.data) {
          resolve({
            balance: response.data.data.balance,
            bonus: response.data.data.bonus,
            points: response.data.data.points,
          });
        } else {
          resolve({
            balance: 0,
            bonus: 0,
            points: 0,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          reject(error.response.data);
        } else if (error.request) {
          reject(error.request.data);
        } else {
          reject(error.message.data);
        }
      });
  });
}

function getFreeBets(auth) {
  const url = "https://api-freebets.betika.com/free-bets-profile";

  const body = {
    token: auth.token,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        // reject(error);
        if (error.response) {
          reject(error.response);
        } else if (error.request) {
          reject(error.request);
        } else {
          reject(error.message);
        }
      });
  });
}

function getOpenBets(auth) {
  return new Promise((resolve, reject) => {
    getBetHistory(auth)
      .then((history) => {
        const bets = history.filter((elem) => elem.bet_status == "Open");
        resolve(bets);
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

function getBetHistory(auth) {
  const url = "https://api.betika.com/v1/uo/bethistory";

  const body = {
    page: 1,
    limit: 1000,
    period: "YEAR",
    product: "NORMAL",
    profile_id: auth.user_id,
    token: auth.token,
  };

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        const history = [];
        response.data.bets.forEach((elem) => {
          history.push({
            short_bet_id: elem.short_bet_id,
            bet_id: elem.bet_id,
            created: elem.created,
            total_odd: elem.total_odd,
            reference: elem.reference,
            bet_amount: elem.bet_amount,
            possible_win: elem.possible_win,
            status: elem.status,
            bet_type: elem.bet_type,
            category: elem.category,
            wht_taxable_amount: elem.wht_taxable_amount,
            taxable_amount: elem.taxable_amount,
            tax_amount: elem.tax_amount,
            cash_stake_ratio: elem.cash_stake_ratio,
            cashout_amount: elem.cashout_amount,
            bonus_bet_amount: elem.bonus_bet_amount,
            is_bonus: elem.is_bonus,
            is_free_bet: elem.is_free_bet,
            bet_status: elem.betStatus.text,
          });
        });
        resolve(history);
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
  getAuthToken,
  getBalance,
  getFreeBets,
  getOpenBets,
  getBetHistory,
};
