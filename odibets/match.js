const axios = require("axios");
const moment = require("moment");

function getPreMatches(sport_id = "soccer", limit = 10) {
  const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "Referer": "https://odibets.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }

  const url = `https://apis.odibets.com/v4/matches?src=2&sport_id=${sport_id}&tab=&country_id=&day=&sort_by=&competition_id=&trials=0`;
  const matches = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.competitions.forEach((competition) => {
          if (competition.matches) {
            competition.matches.forEach((match) => {
              matches.push({
                parent_match_id: match.parent_match_id,
                home_team: match.home_team,
                away_team: match.away_team,
                competition_id: match.competition_id,
                competition_name: match.competition_name,
                sport_id: match.sport_id,
                sport_name: match.sport_name,
                start_time: moment(
                  match.start_time,
                  "YYYY-MM-DD h:mm:ss"
                ).unix(),
              });
            });
          }
        });
        resolve(matches.splice(0, limit));
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

function getLiveMatches(sport_id = "soccer", limit = 1) {
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua":
      '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    Referer: "https://odibets.com/",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  const url = `https://apis.odibets.com/v5/matches?src=1&sport_id=${sport_id}&tab=&country_id=&day=&sub_type_id=&specifiers=&sort_by=&competition_id=&trials=0`;
  const matches = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.competitions.forEach((competition) => {
          if (competition.matches) {
            competition.matches.forEach((match) => {
              matches.push({
                parent_match_id: match.parent_match_id,
                home_team: match.home_team,
                away_team: match.away_team,
                competition_id: match.competition_id,
                competition_name: match.competition_name,
                sport_id: match.sport_id,
                sport_name: match.sport_name,
                start_time: moment(
                  match.start_time,
                  "YYYY-MM-DD h:mm:ss"
                ).unix(),
              });
            });
          }
        });
        resolve(matches.splice(0, limit));
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

function getMatchMarkets(parent_match_id, sub_type_id = "") {
  const headers = {
    accept: "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua":
      '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Linux"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    cookie:
      "odibetskenya=e7k9r45cvehc0e8ealooh42sk4; _gcl_au=1.1.2116646619.1662586799; _gid=GA1.2.1355511595.1662586801; _sp_srt_id.133d=6bf221b3-806a-4011-a809-223ab3e083a4.1662586787.2.1662591943.1662588101.fccc797d-bef5-4e38-9557-37548783ba25; _ga_94HYZZ5XCK=GS1.1.1662594183.3.1.1662594307.0.0.0; _ga_2YY5CZW56W=GS1.1.1662594168.3.1.1662594311.56.0.0; _ga=GA1.1.808660555.1662586799",
    Referer: `https://odibets.com/match-details/${parent_match_id}`,
    "Referrer-Policy": "strict-origin-when-cross-origin",
  };

  const url = "https://odibets.com/api/matche";
  const body = {
    id: parent_match_id,
    sub_type_id: sub_type_id,
  };
  const markets = [];

  return new Promise((resolve, reject) => {
    axios
      .post(url, body, headers)
      .then((response) => {
        if (!response.data) {
          reject(`No data found  ${url}`);
        }
        response.data.data.markets.forEach((market) => {
          markets.push({
            market_name: market.odd_type,
            sub_type_id: market.sub_type_id,
            outcomes: market.lines.flatMap((grouping) =>
              grouping.outcomes.map((outcome) => {
                return {
                  outcome_id: outcome.outcome_id,
                  outcome_key: outcome.outcome_key,
                  outcome_name: outcome.outcome_name,
                  odd_value: outcome.odd_value,
                  prev_odd_value: outcome.prev_odd_value,
                };
              })
            ),
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

module.exports = {
  getPreMatches,
  getLiveMatches,
  getMatchMarkets,
};
