#

API clients(NodeJS+Axios) for some popular betting sites in Kenya.  
Can be used to compare odds accross the markets for arbitrage betting or to automate the betting process.  
NOTE: Made from XMLHTTPrequest queries made by respective web applications hence may break due to any changes in the  platforms.

## Example usage

It's quite difficult to compare odds across different betting sites because of the different formats used to display odds.  
For example:

```js
const { betika } = require("../betika");
const { odibets } = require("../odibets");

betika.match.getPreMatches().then(matches => {
  console.log(matches);
});

odibets.match.getPreMatches().then(matches => {
  console.log(matches);
});
```

Sample output(truncated)

```js
  
  [{
    parent_match_id: '34277499',
    home_team: 'BILBAO',
    away_team: 'Osasuna',
    competition_id: '14482',
    competition_name: 'LaLiga',
    sport_id: '14',
    sport_name: 'Soccer',
    start_time: 1673294400
  }]

  [{
    parent_match_id: '34277499',
    home_team: 'Athletic Bilbao',
    away_team: 'CA Osasuna',
    competition_id: '8',
    competition_name: 'LaLiga',
    sport_id: '1',
    sport_name: 'Soccer',
    start_time: 1673294400
  }]
```

However since the parent_match_id is the same, we can use it to compare filter matches from both sites.

```js
(async () => {
  let [btk_matches, odi_matches] = await Promise.all([
    betika.match.getPreMatches(),
    odibets.match.getPreMatches(),
  ]);

  btk_matches = btk_matches.filter((elem) =>
    odi_matches.some((m) => m.parent_match_id == elem.parent_match_id)
  );
  odi_matches = odi_matches.filter((elem) =>
    btk_matches.some((m) => m.parent_match_id == elem.parent_match_id)
  );

})();

```

## Markets

Just like the matches, the markets are also shown differently in each site.
  
```js
  let [btk_markets, odi_markets] = await Promise.all([
    betika.match.getMatchMarkets(m_btk.parent_match_id),
    odibets.match.getMatchMarkets(m_odi.parent_match_id),
  ]);

  console.log(btk_markets.find((m) => m.market_name == '1X2'));
  console.log(odi_markets.find((m) => m.market_name == '1X2'));
```

Sample output

```js
{
    "sub_type_id": "1",
    "market_name": "1X2",
    "outcomes": [{
        "outcome_id": "1",
        "outcome_key": "HELLAS VERONA",
        "outcome_name": "1",
        "odd_value": "2.37",
        "special_bet_value": "",
        "parsed_special_bet_value": {
            "": ""
        }
    }, {
        "outcome_id": "2",
        "outcome_key": "draw",
        "outcome_name": "X",
        "odd_value": "3.35",
        "special_bet_value": "",
        "parsed_special_bet_value": {
            "": ""
        }
    }, {
        "outcome_id": "3",
        "outcome_key": "Cremonese",
        "outcome_name": "2",
        "odd_value": "3.35",
        "special_bet_value": "",
        "parsed_special_bet_value": {
            "": ""
        }
    }]
}


{
    "market_name": "1X2",
    "sub_type_id": "1",
    "outcomes": [{
        "outcome_id": "1",
        "outcome_key": "1",
        "outcome_name": "Hellas Verona",
        "odd_value": "2.37",
        "prev_odd_value": "2.35"
    }, {
        "outcome_id": "2",
        "outcome_key": "X",
        "outcome_name": "draw",
        "odd_value": "3.40",
        "prev_odd_value": "3.4"
    }, {
        "outcome_id": "3",
        "outcome_key": "2",
        "outcome_name": "US Cremonese",
        "odd_value": "3.40",
        "prev_odd_value": "3.45"
    }]
}

```

We compare markets using the sub_type_id because this is consistent across the two sites.

```js
  let [btk_markets, odi_markets] = await Promise.all([
    betika.match.getMatchMarkets(m_btk.parent_match_id),
    odibets.match.getMatchMarkets(m_odi.parent_match_id),
  ]);

  btk_markets = btk_markets.filter((elem) =>
    odi_markets.some((m) => m.sub_type_id == elem.sub_type_id)
  );
  odi_markets = odi_markets.filter((elem) =>
    btk_markets.some((m) => m.sub_type_id == elem.sub_type_id)
  );
```
