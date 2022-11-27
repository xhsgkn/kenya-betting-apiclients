const { getPreMatches, getLiveMatches, getMatchMarkets } = require("./match");

const {
  getAuthToken,
  getBalance,
  getOpenBets,
  getFreeBets,
} = require("./user");

const { placeBet, placeFreeBet } = require("./bet");

const odibets = {
  match: {
    getPreMatches,
    getLiveMatches,
    getMatchMarkets,
  },
  bet: {
    placeBet,
    placeFreeBet,
  },
  user: {
    getAuthToken,
    getBalance,
    getOpenBets,
    getFreeBets,
  },
};

module.exports = { odibets };
