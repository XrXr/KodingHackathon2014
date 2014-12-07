/* derpy module for indentifying headlines that are about conflicts,
   and where they happen
*/
var extend = require("extend");
var tokenizer = new (require('natural').WordTokenizer)();

var conflictKeyWords = Object.create(null);  // using this as a hashtable
var countries = Object.create(null);  // using this as a hashtable
require("./keywords.json").forEach(function (e) {
    conflictKeyWords[e.toLowerCase()] = null;  // the value doesn't matter
});
require("./countries.json").forEach(function (e) {
    countries[e.toLowerCase()] = null;  // the value doesn't matter
});

/*
  Param articles: [Extracted data from call to extract()]
  return [Conflict]
*/
function analyze (articles) {
    var conflicts = [];
    articles = articles.map(extract);
    articles.forEach(function (article) {
        var titleWords = tokenizer.tokenize(article.title);
        titleWords = titleWords.map(function (s) {return s.toLowerCase();});
        var isConflict = titleWords.some(function (word) {
            if (word in conflictKeyWords) {
                titleWords.some(function (word_) {
                    if (word_ in countries) {
                        conflicts.push(extend(article, {
                            country: word_,
                            type: word,
                        }));
                        return true;
                    }
                });
                return true;
            }
        });
    });
    return conflicts;
}

// extract information from feed parser parse result
function extract (parsed) {
    var date;
    if (parsed.hasOwnProperty("rss:pubdate")) {
        if (parsed["rss:pubdate"].hasOwnProperty("#")) {
            date = parsed["rss:pubdate"]["#"];
        }
    }
    if (!date) {
        date = (new Date()).toString();
    }
    return {
        title: parsed.title || "",
        date: date,
        source: parsed.meta.title,
        link: parsed.guid
    };
}

module.exports.analyze = analyze;