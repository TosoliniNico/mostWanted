var HashMap = require("hashmap");
const prompt = require("prompt-sync")({sigint: true});
const getSuspectData = require("./data/criminals.js");

const map = new HashMap();
console.log('Welcome to Police Search by Name Application!');

async function main() {
  let name = [];
  let alias = [];
  let aliasTemp;
  let nameTemp;
  
  getSuspectData.getSuspectData(map);
  const criminalForSearch = setCriminalForSearch().toLowerCase();

  const values = map.values();
  const keys = map.keys();

  for (var i = 0; i < keys.length; i++) {
    const str = keys[i];
    const searchedValue = str.toLowerCase().search(criminalForSearch);

    if (searchedValue > -1) {
      aliasTemp = map.get(str);
      nameTemp = map.search(aliasTemp);
      name.push(nameTemp);
      alias.push(aliasTemp);
    }
  }

  if (!aliasTemp) {
    for (var i = 0; i < values.length; i++) {
      const str = values[i];
      if (str !== null) {
        const searchedAlias = str.toLowerCase().search(criminalForSearch);
        if (searchedAlias > -1) {
          nameTemp = map.search(str);
          aliasTemp = map.get(nameTemp);
          name.push(nameTemp);
          alias.push(aliasTemp);
        }
      }
    }
  }
  const fullMatch = isFullMatch(name, alias, criminalForSearch);

  if (fullMatch) {
    name = [fullMatch[0]]
    alias = [fullMatch[1]]
  }

  printResult(name, alias);
}

const setCriminalForSearch = () => {
  let isvalid = false;
  let criminal;

  while (!isvalid) {
    criminal = prompt(
      "Please enter a name or alias: "
    );
    criminal = String(criminal);
    criminal = criminal.trim();

    if (criminal.length > 1) {
      break;
    } else {
      console.log("Sorry, enter a valid name!");
    }
  }
  return criminal;
};

const printResult = (name, alias) => {

  if (name.length > 0) {
    for (var i = 0; i < name.length; i++) {
      console.log("First name:", name[i], "Aliases:", alias[i]);
    }
    console.log("\nNew search, for exit please press Ctrl+c");
    main();
  } else {
    console.log("No match");
    main();
  }
};

const isFullMatch = (name, alias, criminalForSearch) => {
  let response;
  let isFullMatchName;

  for (let i = 0; i < name.length; i++) {
    isFullMatchName = name[i].toLowerCase().match((criminalForSearch + ' '));
    if (isFullMatchName) {
      name = name[i];
      alias = alias[i];
      response = [name, alias];
      return response;
    } else {
      for (let i = 0; i < alias.length; i++) {
        isFullMatchAlias = alias[i].toLowerCase().match((criminalForSearch.toLowerCase() + ' '));
        if (isFullMatchAlias) {
          name = name[i];
          alias = alias[i];
          response = [name, alias];
          return response;
        }
      }
    }
  }
};

main();
