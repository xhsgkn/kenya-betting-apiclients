const axios = require("axios");
const moment = require("moment");

const headers = {
  accept: "application/json, text/plain, */*",
  "accept-encoding": "gzip, deflate",
  "accept-language": "en-US,en;q=0.9",
  connection: "keep-alive",
  host: "api.betika.com",
  origin: "http://localhost",
  referer: "http://localhost/",
  "user-agent":
    "Mozilla/5.0 (Linux; Android 10; Google Nexus 7 Build/QQ1D.200105.002; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/74.0.3729.186 Safari/537.36",
  "x-requested-with": "com.dmk.betika",
};

function getPreMatches(sport_id = 14, page = 0, limit = 1) {
  const url = `https://api.betika.com/v1/uo/matches?page=${page}&limit=${limit}&sub_type_id=1&sport_id=${sport_id}&sort_id=1&period_id=-1&esports=false`;
  const matches = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.forEach((match) => {
          matches.push({
            parent_match_id: match.parent_match_id,
            home_team: match.home_team,
            away_team: match.away_team,
            competition_id: match.competition_id,
            competition_name: match.competition_name,
            sport_id: match.sport_id,
            sport_name: match.sport_name,
            start_time: moment(match.start_time, "YYYY-MM-DD h:mm:ss").unix(),
          });
        });
        resolve(matches);
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

function getLiveMatches(sport_id = 14, page = 0, limit = 1) {
  const url = `https://live.betika.com/v1/uo/matches?page=${page}&limit=${limit}&sub_type_id=1&sport=${sport_id}&sort=1`;
  const matches = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.forEach((match) => {
          matches.push({
            parent_match_id: match.parent_match_id,
            home_team: match.home_team,
            away_team: match.away_team,
            competition_id: match.competition_id,
            competition_name: match.competition_name,
            sport_id: match.sport_id,
            sport_name: match.sport_name,
            start_time: moment(match.start_time, "YYYY-MM-DD h:mm:ss").unix(),
          });
        });
        resolve(matches);
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

function getMatchMarkets(parent_match_id) {
  const url = `https://api.betika.com/v1/uo/match?parent_match_id=${parent_match_id}`;
  const markets = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.forEach((market) => {
          markets.push({
            sub_type_id: market.sub_type_id,
            market_name: market.name,
            outcomes: market.odds.map((odd) => {
              return {
                outcome_id: odd.outcome_id,
                outcome_key: odd.odd_key,
                outcome_name: odd.display,
                odd_value: odd.odd_value,
                special_bet_value: odd.special_bet_value,
                parsed_special_bet_value: odd.parsed_special_bet_value,
              };
            })
          });
        });
        resolve(markets);
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

function getPreMatchByID(match_id) {
  const url = `https://api.betika.com/v1/uo/match?id=${match_id}`;
  const match = {};

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data.data) {
          reject(`No data found  ${url}`);
        }

        match.meta = response.data.meta;
        match.meta.bet_status = "NOT_STARTED";
        let markets = {};
        response.data.data.forEach((market) => {
          let odds = {};
          market.odds.forEach((odd) => {
            odds[odd.odd_key] = odd;
          });
          markets[market.sub_type_id] = {
            sub_type_id: market.sub_type_id,
            name: market.name,
            odds,
          };
        });
        match.markets = markets;
        resolve(match);
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
  getPreMatches,
  getLiveMatches,
  getMatchMarkets
};
