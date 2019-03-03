'use strict';

const inquirer = require('inquirer');

inquirer.registerPrompt('autocomplete', require('inquirer-autocomplete-prompt'));

const showPosts = (titles, text) => {
    if(titles.length === 0){
        console.error("¯\\_(ツ)_/¯ No " + text + " found. Please try again.");
        process.exit(1);
    }
    
    return inquirer.prompt([{
        type: 'rawlist',
        name: 'title',
        message: '🌎  Here are your ' + text + ':',
        choices: titles,
        paginated: true
    }])
}

module.exports = {
    showPosts
};