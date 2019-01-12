const inquirer = require('inquirer');
const {
    GenerateQuestionObj
} = require('./q-builder');
const {
    CatchPokemon
} = require('./item-generation');

function AttemptToCatch() {
    var luck = CheckLuck();
    if (!luck) {
        console.log("Couldn't find anything yet");
    } else {
        DisplayPrompt();
    }
}

function DisplayPrompt() {
    inquirer.prompt([GenerateQuestionObj()]).then((answers) => {
        if (!answers.catch.includes('N')) {
            console.log('Nice! you found something!');
            CatchPokemon();
        }
    });
}

function CheckLuck() {
    const _maxNum = 50000;
    var randNum = Math.floor(Math.random() * _maxNum) + 1;
    if (randNum % 5 === 0 || randNum % 11 === 0) {
        return true;
    }
    return false;
}

module.exports = {
    AttemptToCatch
}