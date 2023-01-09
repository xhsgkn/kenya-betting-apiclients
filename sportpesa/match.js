const axios = require('axios');
const moment = require('moment');

function getPreMatches(sport_id = 14, page = 0, limit = 10) {
  const headers = {
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en,en-US;q=0.9',
    'sec-ch-ua':
      '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'x-app-timezone': 'Africa/Nairobi',
    'x-requested-with': 'XMLHttpRequest',
    cookie:
      'spkessid=2ju0m7vhj87pd4ruet48fklfgb; device_view=full; visited=1; locale=en; initialTrafficSource=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set); __utmzzses=1; _gid=GA1.2.468076533.1673264009; _gat_UA-47970910-1=1; _fbp=fb.1.1673264012734.498158925; _hjSessionUser_1199008=eyJpZCI6IjMwOTAzODU0LTk1MmUtNTE1NC1hNGUwLTM4ZTYzNTQ2MDQ1NCIsImNyZWF0ZWQiOjE2NzMyNjQwMTI4MjksImV4aXN0aW5nIjpmYWxzZX0=; _hjFirstSeen=1; _hjIncludedInSessionSample=0; _hjSession_1199008=eyJpZCI6ImY4ZjYzMjEzLWVmZDktNGRjNi04NDJlLThjZWIzNDFlMDg1YyIsImNyZWF0ZWQiOjE2NzMyNjQwMTM1OTcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga=GA1.2.1404251417.1673264009; _gat_xtremepush=1; cookies_consented=1; LPVID=M1N2MwNWJlZGMwYmRlZGNm; LPSID-85738142=qbC1cbI7R0qa7hSbJE-uqQ; _ga_5KBWG85NE7=GS1.1.1673264009.1.1.1673264042.27.0.0',
    Referer:
      'https://www.ke.sportpesa.com/sports/football?sportId=1&section=highlights',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
  };

  const url = `https://www.ke.sportpesa.com/api/todays/1/highlights?type=prematch&section=today_highlights&markets_layout=multiple&o=startTime&pag_count=${limit}&pag_min=1`;
  const matches = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data) {
          reject(`No data found  ${url}`);
        }
        response.data.forEach((match) => {
          matches.push({
            parent_match_id: match.id,
            home_team: match.competitors[0].name,
            away_team: match.competitors[1].name,
            competition_id: match.competition.id,
            competition_name: match.competition.name,
            sport_id: match.sport.id,
            sport_name: match.sport.name,
            start_time: moment(match.date).unix(),
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

getPreMatches().then((data) => {
  getMatchMarkets(data[0].parent_match_id).then((markets) => {
    console.log(markets[0].outcomes);
  });
});

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
            start_time: moment(match.start_time, 'YYYY-MM-DD h:mm:ss').unix(),
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
  const headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en,en-US;q=0.9",
    "sec-ch-ua": "\"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"108\", \"Google Chrome\";v=\"108\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-app-timezone": "Africa/Nairobi",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "spkessid=2ju0m7vhj87pd4ruet48fklfgb; device_view=full; visited=1; locale=en; initialTrafficSource=utmcsr=(direct)|utmcmd=(none)|utmccn=(not set); __utmzzses=1; _gid=GA1.2.468076533.1673264009; _fbp=fb.1.1673264012734.498158925; _hjFirstSeen=1; _hjIncludedInSessionSample=0; _hjSession_1199008=eyJpZCI6ImY4ZjYzMjEzLWVmZDktNGRjNi04NDJlLThjZWIzNDFlMDg1YyIsImNyZWF0ZWQiOjE2NzMyNjQwMTM1OTcsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; cookies_consented=1; LPVID=M1N2MwNWJlZGMwYmRlZGNm; LPSID-85738142=qbC1cbI7R0qa7hSbJE-uqQ; _ga=GA1.2.1404251417.1673264009; _hjSessionUser_1199008=eyJpZCI6IjMwOTAzODU0LTk1MmUtNTE1NC1hNGUwLTM4ZTYzNTQ2MDQ1NCIsImNyZWF0ZWQiOjE2NzMyNjQwMTI4MjksImV4aXN0aW5nIjp0cnVlfQ==; _ga_5KBWG85NE7=GS1.1.1673264009.1.1.1673265353.56.0.0",
    "Referer": "https://www.ke.sportpesa.com/sports/football?sportId=1&section=highlights&locationAnchor=3033",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }

  const url = `https://www.ke.sportpesa.com/api/games/markets?games=${parent_match_id}&markets=all`;
  const markets = [];

  return new Promise((resolve, reject) => {
    axios
      .get(url, headers)
      .then((response) => {
        if (!response.data[parent_match_id]) {
          reject(`No data found  ${url}`);
        }
        response.data[parent_match_id].forEach((market) => {
          markets.push({
            sub_type_id: market.id,
            market_name: market.name,
            outcomes: market.selections.map((selection) => {
              return {
                outcome_id: selection.id,
                outcome_key: selection.name,
                outcome_name: selection.shortName,
                odd_value: parseFloat(selection.odds),
                special_bet_value: selection.specValue,
                parsed_special_bet_value: selection.specValue,
              };
            }),
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
        match.meta.bet_status = 'NOT_STARTED';
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
  getMatchMarkets,
};
