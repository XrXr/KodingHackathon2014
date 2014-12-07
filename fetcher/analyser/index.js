/* derpy module for indentifying headlines that are about conflicts,
   and where they happen
*/
var tokenizer = new (require('natural').WordTokenizer)();

var conflictKeyWords = Object.create(null);  // using this as a hashtable
var countries = Object.create(null);  // using this as a hashtable
require("./keywords.json").forEach(function (e) {
    conflictKeyWords[e.toLowerCase()] = null;  // the value doesn't matter
});
require("./countries.json").forEach(function (e) {
    countries[e.toLowerCase()] = null;  // the value doesn't matter
});

function Conflict (type, country, date) {
    this.type = type;
    this.country = country;
    this.date = date;
}

/*
  Param articles: [[Title, Date]]
  return [Conflict]
*/
function analyze (articles) {
    var title = 0;
    var date = 1;
    var conflicts = [];
    articles.forEach(function (article) {
        var words = tokenizer.tokenize(article[title]);
        words = words.map(function (s) {return s.toLowerCase();});
        var isConflict = words.some(function (word) {
            if (word in conflictKeyWords) {
                words.some(function (word_) {
                    if (word_ in countries) {
                        conflicts.push(new Conflict(word, word_, article[date]));
                        return true;
                    }
                });
                return true;
            }
        });
    });
    return conflicts;
}

module.exports.analyze = analyze;