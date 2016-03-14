/**
 * Created by chimwemwe on 2/26/16.
 */

module.exports = function (router) {

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

    router.route('/')
        .get(function (req, res) {

            var activeFacilities = require(path.resolve('config', 'active_facilities.json'))

            res.render('index', {activeFacilities: JSON.stringify(activeFacilities)});

        })

    router.route('/query_site/:id')
        .get(function (req, res) {

            var file = path.resolve("config", "sites", req.params.id + ".json");

            if (fs.existsSync(file)) {

                var today = new Date();

                var year = String(today.getFullYear());

                var month = padZeroes(today.getMonth() + 1, 2);

                var date = padZeroes(today.getDate(), 2);

                // var site = require(file);

                var contents = fs.readFileSync(file);

                var site = JSON.parse(contents);

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

                res.status(200).json({today: site[year][month][date], this_month: monthTotals[parseInt(month) - 1],
                    this_year: yearTotal});

            } else {

                res.status(200).json({today: 0, this_month: 0, this_year: 0});

            }

        })

    return router;

}
