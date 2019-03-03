'use strict';

const Xray = require('x-ray');
const algoliasearch = require('algoliasearch');
const client = algoliasearch('YE5Y9R600C', 'OTU1YjU5MWNlZTk1MjQ0YmExOTRjZmY4NDM2ZTM2YWZiYTM2ODA2NThhMzNjMDkzYTEzYjFmNDY0MDcwNjRkOHJlc3RyaWN0SW5kaWNlcz1zZWFyY2hhYmxlc19wcm9kdWN0aW9uJTJDVGFnX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX3Byb2R1Y3Rpb24lMkNvcmRlcmVkX2FydGljbGVzX2J5X3B1Ymxpc2hlZF9hdF9wcm9kdWN0aW9uJTJDb3JkZXJlZF9hcnRpY2xlc19ieV9wb3NpdGl2ZV9yZWFjdGlvbnNfY291bnRfcHJvZHVjdGlvbiUyQ29yZGVyZWRfY29tbWVudHNfcHJvZHVjdGlvbg==');
const index = client.initIndex('searchables_production');

const xray = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    removeNewLine: function (value) {
      return value.replace(/\s\s+/g, ' ');
    }
  }
});

const fetchHome = () => {
  return xray('https://www.producthunt.com/', '.content_2d8bd .postsList_b2208 li', [{
    title: '.link_523b9 .content_31491 h3 | trim',
    description: '.link_523b9 .content_31491 p | trim',
    author: 'h4 a | trim',
    link: '.link_523b9@href',
    upvotes: '.voteButtonWrap_4c515 .buttonContainer_b6eb3 span',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchSearchResults = (query) => {
  return xray('https://www.producthunt.com/search?q=' + query, '.content_111fa .postsList_b2208 li', [{
    title: '.link_523b9 .content_31491 h3 | trim',
    description: '.link_523b9 .content_31491 p | trim',
    link: '.link_523b9@href',
    upvotes: '.voteButtonWrap_4c515 .buttonContainer_b6eb3 span',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchTopics = (query) => {
  return xray('https://www.producthunt.com/topics', '.content_2d8bd .item_56e23', [{
    title: '.info_d7201 span | trim',
    link: '.info_d7201@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchJobs = () => {
  return xray('https://www.producthunt.com/jobs', '.container_2ae19 .white_7a18a .item_f6569', [{
    title: '.itemInfos_0b720 a h3 | trim',
    position: '.itemInfos_0b720 a span | trim',
    posted: 'div time | trim',
    location: '.right_488cb span | trim',
    link: 'a@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchRemoteJobs = () => {
  return xray('https://www.producthunt.com/jobs?remote_ok=true', '.container_2ae19 .white_7a18a .item_f6569', [{
    title: '.itemInfos_0b720 a h3 | trim',
    position: '.itemInfos_0b720 a span | trim',
    posted: 'div time | trim',
    location: '.right_488cb span | trim',
    link: 'a@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchUpcoming = () => {
  return xray('https://www.producthunt.com/upcoming', '.item_6a520', [{
    title: '.link_2a415 .title_39c87 | trim',
    description: '.link_2a415 .tagline_ce810 | trim',
    link: '.link_2a415@href',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchLatest = () => {
  return xray('https://www.producthunt.com/newest', '.content_2d8bd .postsList_b2208 li', [{
    title: '.link_523b9 .content_31491 h3 | trim',
    description: '.link_523b9 .content_31491 p | trim',
    author: 'h4 a | trim',
    link: '.link_523b9@href',
    upvotes: '.voteButtonWrap_4c515 .buttonContainer_b6eb3 span',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const fetchByAuthor = (author) => {
  return xray('https://www.producthunt.com/@' + author + '/submitted', '.content_7c39f .postsList_b2208 li', [{
    title: '.link_523b9 .content_31491 h3 | trim',
    description: '.link_523b9 .content_31491 p | trim',
    link: '.link_523b9@href',
    upvotes: '.voteButtonWrap_4c515 .buttonContainer_b6eb3 span',
    tag: ['.tags .tag | trim']
  }]).then(data => {
    return formatTitle(data);
  });
}

const formatTitle = (posts) => {
  return posts.map(post => {
    post.tag.forEach(tag => {
      if (post.title.indexOf(tag) > -1) post.title = post.title.split(tag)[1];
      if (post.location == undefined) post.location = '';
    })
    return post;
  });
}

module.exports = {
  fetchHome,
  fetchByAuthor,
  fetchJobs,
  fetchRemoteJobs,
  fetchLatest,
  fetchUpcoming,
  fetchSearchResults,
  fetchTopics
};