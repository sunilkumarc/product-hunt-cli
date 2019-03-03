#! /usr/bin/env node

const program = require('commander');
const opn = require('opn');
const escExit = require('esc-exit');

const crawler = require('./util/crawler');
const countdown = require('./util/spinner');
const prompt = require('./util/prompt');

let articles;

escExit();

const openBasicLink = (answers) => {
    opn(articles.find(data => data.title === answers.title).link);
    process.exit();
}

const openLink = (answers) => {
    opn(articles.find(data => (data.title + ' (' + data.description + ')' + ' [' + data.upvotes + ']') === answers.title).link);
    process.exit();
}

const openJobsLink = (answers) => {
    opn(articles.find(data => (data.title + ' [Position: ' + data.position + ', Location: ' + data.location + ', Posted: ' + data.posted + ']') === answers.title).link);
    process.exit();
}

const openUpcomingLink = (answers) => {
    opn(articles.find(data => (data.title + ' | ' + data.description) === answers.title).link);
    process.exit();
}

program
    .version('1.0.0')

program
    .command("latest")
    .alias("l")
    .action(() => {
        countdown.start();

        crawler.fetchLatest().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title + ' (' + data.description + ')' + ' [' + data.upvotes + ']'), 'latest posts').then(answers => {
                openLink(answers);
            });
        })
    })

program
    .command("upcoming")
    .alias("j")
    .action(() => {
        countdown.start();
        crawler.fetchUpcoming().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title + ' | ' + data.description), 'upcoming posts').then(answers => {
                openUpcomingLink(answers);
            });
        })
    })

program
    .command("jobs")
    .alias("j")
    .action(() => {
        countdown.start();
        crawler.fetchJobs().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title + ' [Position: ' + data.position + ', Location: ' + data.location + ', Posted: ' + data.posted + ']'), 'jobs').then(answers => {
                openJobsLink(answers);
            });
        })
    })

    
program
    .command("remote")
    .alias("r")
    .action(() => {
        countdown.start();
        crawler.fetchRemoteJobs().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            let loc = data.location;
            if (loc == undefined) loc = 'Remote';
            prompt.showPosts(articles.map(data => data.title + ' [Position: ' + data.position + ', Location: ' + loc + ', Posted: ' + data.posted + ']'), 'remote jobs').then(answers => {
                openJobsLink(answers);
            });
        })
    })

program
    .command("topics")
    .alias("t")
    .action(() => {
        countdown.start();
        crawler.fetchTopics().then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title), 'topics').then(answers => {
                openBasicLink(answers);
            });
        })
    })

program
    .command("search <keyword>")
    .alias("s")
    .action((keyword) => {
        countdown.start();
        crawler.fetchSearchResults(keyword).then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title + ' (' + data.description + ')' + ' [' + data.upvotes + ']'), 'results').then(answers => {
                openLink(answers);
            });
        });
    })

program
    .command("author <username>")
    .alias("a")
    .action((keyword) => {
        countdown.start();
        crawler.fetchByAuthor(keyword).then(data => {
            countdown.stop();
            articles = data.filter(data => data.title != undefined);
            prompt.showPosts(articles.map(data => data.title + ' (' + data.description + ')' + ' [' + data.upvotes + ']'), 'posts').then(answers => {
                openLink(answers);
            });
        });
    })

program.on('command:*', function () {
    console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
    process.exit(1);
  });

program.parse(process.argv);

if (program.args.length === 0) {
    countdown.start();
    crawler.fetchHome().then(data => {
        countdown.stop();
        articles = data.filter(data => data.title != undefined);
        prompt.showPosts(articles.map(data => data.title + ' (' + data.description + ')' + ' [' + data.upvotes + ']'), 'posts').then(answers => {
            openLink(answers);
        });
    })
}