/*
  fetch from RSS feeds.
*/
var fs = require("fs");
var when = require("when");
var request = require("request");
var iconv = require('iconv-lite');
var FeedParser = require('feedparser');

var configFileName = "./feeds";
var configFileEncoding = "ASCII";
var retryDelay = 300000; // 5 minutes
var maxRetries = 3;


/*
  Start a fetch on rss sources in ./feeds
  return a promise
*/
function fetchAndParse () {
    return when.promise(function (resolve, reject) {
        // doing it this way adds to the complexity, but it still should be clear
        // this is mutated by `handleArticles()` until all the retry limit has hit
        // or all the sources have been successfully fetched
        var finalResults = [];
        // load feeds from config file
        var readFeeds = when.promise(function(resolve, reject) {
            fs.readFile(configFileName, {
                encoding: configFileEncoding
            }, function(err, data) {
                if (err) reject(err);
                resolve(data);
            });
        });

        readFeeds.then(splitLines).then(function (feedAddresses) {
            return when.unfold(requestAndParse,
                function (needToProcess) {
                    return needToProcess.length === 0;
                }, handleArticles, feedAddresses.map(wrapAddress));
        }).done(function () {
            resolve(finalResults);
        });

        function handleArticles (feedContents) {
            feedContents.forEach(function (articles) {
                if (articles.length > 0) {
                    console.log("%s has %d articles in it!", articles[0].meta.title, articles.length);
                }
                finalResults = finalResults.concat(articles);  // accumulate the data
            });
            if (feedContents.hasOwnProperty("!!somefetchFailed")) {  // HACK: see requestAndParse()
                return when.promise(function (resolve) {
                    // this will delay the next iteration in unfold by `retryDelay`
                    setTimeout(resolve, retryDelay);
                });
            }
        }
    });

}


function splitLines(str) {
    return str.split("\n");
}

// wrap an address with a request counter
function wrapAddress (address) {
    return [address, 0];
}

/* part of the when.unfold() above*/
function requestAndParse(feedAddresses) {
    if (feedAddresses.length === 0) return;

    var url = 0;
    var requestCount = 1;
    function requestFeed(address) {
        return when.promise(function (resolve, reject) {
            var req = request(address[url], {
                timeout: 10000,
                pool: false,
                headers: {
                    "user-agent": 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36',
                    "accept": "text/html,application/xhtml+xml"
                }
            });
            req.setMaxListeners(50);
            var feedparser = new FeedParser();
            req.on("error", reject);
            req.on("response", function(res) {
                if (res.statusCode !== 200) return this.emit('error', new Error("Bad status code: " + res.statusCode));
                var charset = getParams(res.headers['content-type'] || '').charset;
                res = maybeTranslate(res, charset);
                res.pipe(feedparser);
            });

            feedparser.on('error', reject);

            var rssItems = [];

            feedparser.on('readable', function() {
                var post;
                while ((post = this.read())) {
                    rssItems.push(post);  // accumulate data in it
                }
            });
            // when there isn't any more data, resolve the promise
            feedparser.on('end', function () {
                resolve(rssItems);
            });

            function maybeTranslate(res, charset) {
                // Use iconv if its not utf8 already.
                if (charset && !/utf-*8/i.test(charset)) {
                    try {
                        console.log('Converting from charset %s to utf-8', charset);
                        iconv.on('error', reject);
                        // If we're using iconv, stream will be the output of iconv
                        // otherwise it will remain the output of request
                        res = res.pipe(iconv.decodeStream(encoding))
                            .pipe(iconv.encodeStream('utf-8'));
                    } catch (err) {
                        res.emit('error', err);
                    }
                }
                return res;
            }
        });
    }
    var requests = feedAddresses.map(requestFeed);
    var resolved = when.settle(requests);
    return resolved.then(function (results) {
        var needToRetry = [];
        var processed = [];
        for (var i = 0; i < results.length; i++) {
            if (results[i].state === "rejected") {
                if (feedAddresses[i][requestCount] < maxRetries) {  // stop trying after `maxRetries`
                    // build a new element based on the old
                    needToRetry.push([feedAddresses[i][url], feedAddresses[i][requestCount] + 1]);
                } else {
                    console.error("Fetcher: Warning! Feed: \"%s\" exceeded maximum retries! (%d)",
                        feedAddresses[i][url], maxRetries);
                }
            } else {
                processed.push(results[i].value);  // fullfilled
            }
        }
        // HACK: for the handler knowing not to delay for the last iteration
        if (needToRetry.length !== 0) {
            processed["!!somefetchFailed"] = true;
        }
        return [processed, needToRetry];  // this array is [valueToSendToHandler, newSeed]
    });
}

function getParams(str) {
    var params = str.split(';').reduce(function(params, param) {
        var parts = param.split('=').map(function(part) {
            return part.trim();
        });
        if (parts.length === 2) {
            params[parts[0]] = parts[1];
        }
        return params;
    }, {});
    return params;
}

// fetchAndParse().then(function (e) {console.log(e.length);});

module.exports.fetchAndParse = fetchAndParse;