/**
 * Created by chimwemwe on 2/26/16.
 */

module.exports = function (router) {

    var numeral = require("numeral");

    var fs = require('fs');

    var dateFormat = require('dateformat');

    var url = require('url');

    var path = require('path');

    function padZeroes(num, zeros) {

        if (String(num).trim().length < zeros) {

            var pad = "";

            for (var i = 0; i < (zeros - String(num).trim().length); i++) {

                pad += "0";

            }

            return pad + String(num).trim();

        } else {

            return String(num).trim();

        }

    }

    function retrieveStats(site) {

        var max_age = 60 * 60 * 1000;

        var file = path.resolve("public", "sites", site + ".json");

        if (!fs.existsSync(path.resolve("public", "sites"))) {

            fs.mkdir(path.resolve("public", "sites"));

        }

        if (!fs.existsSync(file) || (fs.existsSync(file) && ((new Date()) - (fs.statSync(file).mtime || (new Date()))) >
            max_age)) {

            var FeedParser = require('feedparser')
                , request = require('request');

            var config = path.resolve("config", "connections.json");

            var content = fs.readFileSync(config);

            var settings = JSON.parse(content)[site] || {};

            if(Object.keys(settings).length <= 0) {

                return {};

            }

            var req = request('http://' + settings.host + ':' + settings.port + '/' + settings.path)
                , feedparser = new FeedParser([]);

            req.on('error', function (error) {
                // handle any request errors
            });
            req.on('response', function (res) {
                var stream = this;

                if (res.statusCode != 200) return this.emit('error', new Error('Bad status code'));

                stream.pipe(feedparser);
            });


            feedparser.on('error', function (error) {
                // always handle errors

                console.log(error.message);

            });
            feedparser.on('readable', function () {
                // This is where the action is!
                var stream = this
                    , meta = this.meta // **NOTE** the "meta" is always available in the context of the feedparser instance
                    , item;

                var results = {};

                if (fs.existsSync(file)) {

                    var contents = fs.readFileSync(file);

                    results = JSON.parse(contents);

                }

                while (item = stream.read()) {

                    var parts = item.title.split(":")

                    if (parts.length > 0) {

                        var count = parts[1];

                        var dateParts = parts[0].split("-");

                        var year = dateParts[0];

                        var month = dateParts[1];

                        var date = dateParts[2];

                        if (!results[year]) {

                            results[year] = {};

                        }

                        if (!results[year][month]) {

                            results[year][month] = {};

                        }

                        results[year][month][date] = count;

                    }

                }

                fs.writeFileSync(file, JSON.stringify(results));

            });

        }

        if(fs.existsSync(file)) {

            var contents = JSON.parse(fs.readFileSync(file));

            return contents;

        } else {

            return {};

        }

    }

    router.route('/')
        .get(function (req, res) {

            var activeFacilities = require(path.resolve('config', 'active_facilities.json'))

            res.render('index', {activeFacilities: JSON.stringify(activeFacilities)});

        })

    router.route('/query_site/:id')
        .get(function (req, res) {

            var contents = retrieveStats(req.params.id);

            if (Object.keys(contents).length > 0) {

                var today = new Date();

                var year = String(today.getFullYear());

                var month = padZeroes(today.getMonth() + 1, 2);

                var date = padZeroes(today.getDate(), 2);

                var site = contents;

                // A value for each month
                var monthTotals = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

                var months = Object.keys(site[year]);

                for(var i = 0; i < months.length; i++) {

                    var days = Object.keys(site[year][months[i]])

                    for (var j = 0; j < days.length; j++) {

                        var pos = parseInt([months[i]]) - 1;

                        var value = parseInt(site[year][months[i]][days[j]]);

                        monthTotals[pos] += value;

                    }

                }

                var yearTotal = monthTotals.reduce(function(a, b) { return a + b; } );

                var actualDate = (site[year] && site[year][month] && site[year][month][date] ? site[year][month][date] : 0);

                var actualMonth = (monthTotals[parseInt(month) - 1] || 0)

                res.status(200).json({today: numeral(actualDate).format('0,0'),
                    this_month: numeral(actualMonth).format('0,0'),
                    this_year: numeral(yearTotal || 0).format('0,0')});

            } else {

                res.status(200).json({today: 0, this_month: 0, this_year: 0});

            }

        })

    return router;

}
