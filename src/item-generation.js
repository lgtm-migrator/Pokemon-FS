const {
    GetPokemon,
    GetFileContent,
    WriteToFile
} = require('./file-io');
const {
    AddSearchEntry
} = require('./search-history');
const {
    GetPokemonStats
} = require('./api-access');
var {
    Pokemon
} = require('./models/pokemon');

function CatchPokemon() {
    var newPokemon = "";
    GetPokemon().then(pokemon => {
        var pokemonArry = JSON.parse(pokemon);
        var caughtPokemon = GetRandomPokemon(pokemonArry);
        newPokemon = caughtPokemon;
        console.log(`Congrats you caught ${caughtPokemon}`);  
        return GetFileContent();
    }).then(content => {
        var json = JSON.parse(content);
        if (!json.hasOwnProperty('p-inv')) {
            json['p-inv'] = [];
        }
        return AddPokemon(json, newPokemon);
    }).then(updatedJson => {
        console.log('Writing to File');
        return WriteToFile(JSON.stringify(updatedJson));
    }).then(val => {
        console.log('Wrote to File');
        return AddSearchEntry();
    }).then(val => {
        console.log("Added Search Entry");
        return;
    })
    .catch(error => {
        console.log(error);
    });
}

async function AddPokemon(json, pokemonName) {
    var inventory = json['p-inv'];
    var existingObj = inventory.find(o => {
        if (o.name === pokemonName) {
            return true;
        }
    });
    if (typeof existingObj === 'undefined' && !existingObj) {
        try {
            var pokemon = await GetPokemonStats(pokemonName);
            console.log("pokemon");
            console.log(pokemon);
            inventory.push(pokemon);
            json['p-inv'] = inventory;
            return json;
        } catch (error) {
            console.log("pokemon catch");
            console.log(error);
        }
        var pokemon = new Pokemon(pokemonName, 110, 110);
        inventory.push(pokemon);
        json['p-inv'] = inventory;
    }
    return json;
}

async function CheckInventory(inv, item, type) {
    switch (type) {
        case 'i':
            return inv;
        case 'p':
            var obj = inv['p-inv'].find((o, i) => {
                if (o.name === item) {
                    //Add prompt for duplicate
                    //inv['p-inv'][i].count++;
                    console.log("Already have this pokemon stage");
                    return true;
                }
            });
            if (typeof obj === 'undefined' && !obj) {
                try {
                    var pokemon = await GetPokemonStats(item);
                    console.log("pokemon");
                    console.log(pokemon);
                    inv['p-inv'].push(pokemon);
                } catch (error) {
                    console.log("pokemon catch");
                    var pokemon = new Pokemon(item, 110, 110);
                    inv['p-inv'].push(pokemon);
                }
            }
            return inv;
        default:
            return null;
    }
}

function GetRandomPokemon(pokieArry) {
    var arrayLength = pokieArry.length;
    var indices = [];

    for (var i = 0; i < 3; i++) {
        var randIndex = Math.floor(Math.random() * (arrayLength - 0 + 1) + 0);
        indices.push(randIndex);
    }
    var winner = indices[Math.floor(Math.random() * (2 - 0 + 1) + 0)];
    return pokieArry[winner];
}

module.exports = {
    CatchPokemon
}