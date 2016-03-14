/**
 * Created by chimwemwe on 2/26/16.
 */


var refPoints = [-9.331537, -17.158189, 32.674051, 35.969950];
var offsets = [10, 295, 10, 710];
var limits = [305, 720];
var previous;

function __$(id) {
    return document.getElementById(id);
}

function latLon2Coord(lat, lon) {

    var x, y;

    x = ((offsets[1] - offsets[0]) * ((Math.abs(lon) - Math.abs(refPoints[2])) / (Math.abs(refPoints[3]) - Math.abs(refPoints[2])))) // + offsets[0];

    y = ((offsets[3] - offsets[2]) * ((Math.abs(lat) - Math.abs(refPoints[0])) / (Math.abs(refPoints[1]) - Math.abs(refPoints[0])))) // + offsets[2];

    return [x, y]

}

function setDefaults() {

    var svg = __$("map").contentDocument;

    if (svg == null) {

        setTimeout("setDefaults()", 200);

        return;

    }

    var elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
        "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
        "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi"]

    for (var i = 0; i < elements.length; i++) {

        if (svg.getElementById(elements[i])) {

            svg.getElementById(elements[i]).onmouseover = function () {

                this.setAttribute("style", "fill:#ffcccc;stroke:#6e6e6e;stroke-width:0.40000001000000002;fill-opacity:1");

            }

            svg.getElementById(elements[i]).onmouseout = function () {

                this.setAttribute("style", "fill:#ffffff;stroke:#6e6e6e;stroke-width:0.40000001000000002;fill-opacity:1");

            }

            svg.getElementById(elements[i]).onclick = function () {

                drawBorder(this.id);

            }

        }
    }

    // loadSites();
}

function insertSite(x, y, color, id) {
    var doc = __$("map").contentDocument;

    var mw = doc.getElementById("malawi");

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("cx", x);

    circle.setAttribute("cy", y);

    circle.setAttribute("r", 2);

    circle.setAttribute("id", id);

    circle.setAttribute("fill", color);

    circle.setAttribute("stroke", "black");

    mw.appendChild(circle);
}

function insertSiteByOffset(x, y, color, id, district) {

    var doc = __$("district").contentDocument;

    var mw = doc.getElementById(district);

    var target = districtOffsets[district];

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("cx", (x - target.x));

    circle.setAttribute("cy", (y - target.y));

    circle.setAttribute("r", 2);

    circle.setAttribute("id", id);

    circle.setAttribute("fill", color);

    circle.setAttribute("stroke", "black");

    mw.appendChild(circle);
}

function insertZoneSiteByOffset(x, y, color, id, district) {

    var doc = __$("zone").contentDocument;

    var mw = doc.getElementById(district);

    var target = districtOffsets[district];

    var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

    circle.setAttribute("cx", (x - target.x));

    circle.setAttribute("cy", (y - target.y));

    circle.setAttribute("r", 2);

    circle.setAttribute("id", id);

    circle.setAttribute("fill", color);

    circle.setAttribute("stroke", "black");

    mw.appendChild(circle);
}

function loadSites() {

    for (var i = 0; i < sites.length; i++) {

        var result = latLon2Coord(sites[i][0], sites[i][1])

        var colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

        var pos = Math.round((Math.random() * 10)) % 3;

        insertSite(result[0], result[1], colors[pos], 'site' + i);

    }

}

var uCoords = {};

function getCoords() {

    var svg = __$("map").contentDocument;

    var elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
        "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
        "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi"];

    for (var i = 0; i < elements.length; i++) {

        if (svg.getElementById(elements[i])) {

            var element = svg.getElementById(elements[i]);

            var district = {};

            for (var j = 0; j < element.children.length; j++) {

                if (element.children[j].tagName.match(/desc/i)) {

                    for (var k = 0; k < element.children[j].children.length; k++) {

                        district[element.children[j].children[k].tagName.replace(/namespace\:/i, "")] = element.children[j].children[k].innerHTML;

                    }

                }

            }

            uCoords[elements[i]] = district;

        }
    }

}

function loadDistricts() {

    var elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
        "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
        "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi"];

    for (var i = 0; i < elements.length; i++) {

        var district = districts[elements[i]];

        if (!district)
            continue;

        var result = latLon2Coord(district["lat"], district["lon"])

        var colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

        var pos = Math.round((Math.random() * 10)) % 3;

        insertSite(result[0], result[1], colors[0], 0);

    }

}

function drawBorders() {

    var svg = __$("map").contentDocument;

    var elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
        "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
        "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi"];

    for (var i = 0; i < elements.length; i++) {

        var element = svg.getElementById(elements[i]).getBBox();

        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rect.setAttributeNS(null, 'x', element.x);
        rect.setAttributeNS(null, 'y', element.y);
        rect.setAttributeNS(null, 'height', element.height);
        rect.setAttributeNS(null, 'width', element.width);
        rect.setAttributeNS(null, 'stroke', 'red');
        rect.setAttributeNS(null, 'fill', 'none');
        rect.setAttributeNS(null, 'id', 'rect' + elements[i]);
        svg.getElementById("malawi").appendChild(rect);

    }
}

function drawBorder(district) {

    var names = {
        "chitipa": "Chitipa",
        "karonga": 'Karonga',
        "rumphi": 'Rumphi',
        "mzimba": "Mzimba",
        "nkhatabay": "Nkhata Bay",
        "nkhotakota": "Nkhotakota",
        "salima": "Salima",
        "kasungu": "Kasungu",
        "dedza": "Dedza",
        "lilongwe": "Lilongwe",
        "ntchisi": "Ntchisi",
        "ntcheu": "Ntcheu",
        "mchinji": "Mchinji",
        "dowa": "Dowa",
        "balaka": "Balaka",
        "zomba": "Zomba",
        "machinga": "Machinga",
        "blantyre": "Blantyre",
        "machinga": "Machinga",
        "chiradzulu": "Chiradzulu",
        "chikwawa": "Chikwawa",
        "nsanje": "Nsanje",
        "neno": "Neno",
        "mwanza": "Mwanza",
        "phalombe": "Phalombe",
        "mulanje": "Mulanje",
        "likoma": "Likoma",
        "thyolo": "Thyolo",
        "mangochi": "Mangochi"
    };

    var svg = __$("map").contentDocument;

    if (svg.getElementById('rect' + district)) {

        unloadDistrictSites(district);

        svg.getElementById("malawi").removeChild(svg.getElementById('rect' + district));

    } else {

        var element = svg.getElementById(district).getBBox();

        var rect = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
        rect.setAttributeNS(null, 'x', element.x);
        rect.setAttributeNS(null, 'y', element.y);
        rect.setAttributeNS(null, 'height', element.height);
        rect.setAttributeNS(null, 'width', element.width);
        rect.setAttribute('stroke', 'none');     //'rgba(128,128,128,0.5)');
        rect.setAttribute('fill', 'none');
        rect.setAttribute('id', 'rect' + district);
        svg.getElementById("malawi").appendChild(rect);

        if (svg.getElementById('cursor')) {

            var cursor = svg.getElementById('cursor');

            cursor.setAttributeNS(null, 'x', element.x);
            cursor.setAttributeNS(null, 'y', element.y);
            cursor.setAttributeNS(null, 'height', element.height);
            cursor.setAttributeNS(null, 'width', element.width);

        } else {

            var cursor = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
            cursor.setAttributeNS(null, 'x', element.x);
            cursor.setAttributeNS(null, 'y', element.y);
            cursor.setAttributeNS(null, 'height', element.height);
            cursor.setAttributeNS(null, 'width', element.width);
            cursor.setAttribute('stroke', 'rgba(255,0,0,0.8)');
            cursor.setAttribute('fill', 'none');
            cursor.setAttribute('id', 'cursor');
            svg.getElementById("malawi").appendChild(cursor);

        }

        __$("district").outerHTML = __$("district").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/' + district + '.svg"')

        var target = sites_by_zones[district];

        switch (target[0]["region"]) {
            case "North":
                __$("zone").outerHTML = __$("zone").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/zone_northern.svg"');

                setTimeout("loadZoneSitesByOffsets('zone_northern')", 500);

                break;
            case "Central":
                if (target[0]["zone"] == "Central East") {

                    __$("zone").outerHTML = __$("zone").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/zone_c_east.svg"')

                    setTimeout("loadZoneSitesByOffsets('zone_c_east')", 500);

                } else if (target[0]["zone"] == "Central West") {

                    __$("zone").outerHTML = __$("zone").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/zone_c_west.svg"')

                    setTimeout("loadZoneSitesByOffsets('zone_c_west')", 500);

                }
                break;
            case "South":
                if (target[0]["zone"] == "South East") {

                    __$("zone").outerHTML = __$("zone").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/zone_s_east.svg"')

                    setTimeout("loadZoneSitesByOffsets('zone_s_east')", 500);

                } else if (target[0]["zone"] == "South West") {

                    __$("zone").outerHTML = __$("zone").outerHTML.replace(/data="(.+?)"/, 'data="images/mw/zone_s_west.svg"')

                    setTimeout("loadZoneSitesByOffsets('zone_s_west')", 500);

                }
                break;
        }

        if (previous != undefined) {
            unloadDistrictSites(previous);
        }

        previous = district;

        loadDistrictSites(district);

        setTimeout("loadDistrictSitesByOffsets('" + district + "')", 500);

        if(__$("national_label")){

            __$("national_label").innerHTML = names[district];

        }

        if(__$("district_label")){

            __$("district_label").innerHTML = names[district];

        }

    }

}

function loadDistrictSitesByOffsets(district) {

    var target = sites_by_zones[district];

    for (var i = 0; i < target.length; i++) {

        var result = latLon2Coord(target[i]["latitude"], target[i]["longitude"])

        var colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

        var pos = 0;    // Math.round((Math.random() * 10)) % 3;

        insertSiteByOffset(result[0], result[1], colors[pos], district + '_' + target[i]["facility_id"], district);

    }

}

function loadZoneSitesByOffsets(district) {
    var zone, region;

    switch (district) {
        case "zone_northern":
            zone = "Northern";
            region = "North";
            break;
        case "zone_c_east":
            region = "Central";
            zone = "Central East";
            break;
        case "zone_c_west":
            region = "Central";
            zone = "Central West";
            break;
        case "zone_s_east":
            region = "South";
            zone = "South East";
            break;
        case "zone_s_west":
            region = "South";
            zone = "South West";
            break;
    }

    if (zone == undefined || region == undefined) return;

    var zone_districts = Object.keys(zones[region][zone]);

    for (var s = 0; s < zone_districts.length; s++) {

        var target = sites_by_zones[zone_districts[s]];

        for (var i = 0; i < target.length; i++) {

            var result = latLon2Coord(target[i]["latitude"], target[i]["longitude"])

            var colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

            var pos = 0;    // Math.round((Math.random() * 10)) % 3;

            insertZoneSiteByOffset(result[0], result[1], colors[pos], district + '_' + target[i]["facility_id"], district);

        }

    }

    if(__$("zone_label")){

        __$("zone_label").innerHTML = zone + " Zone";

    }

}

function loadDistrictSites(district) {

    var target = sites_by_zones[district];

    for (var i = 0; i < target.length; i++) {

        var result = latLon2Coord(target[i]["latitude"], target[i]["longitude"])

        var colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

        var pos = 0;    // Math.round((Math.random() * 10)) % 3;

        insertSite(result[0], result[1], colors[pos], target[i]["facility_id"]);

    }

}

function unloadDistrictSites(district) {

    var target = sites_by_zones[district];

    var doc = __$("map").contentDocument;

    var mw = doc.getElementById("malawi");

    for (var i = 0; i < target.length; i++) {

        if (doc.getElementById(target[i]["facility_id"])) {

            mw.removeChild(doc.getElementById(target[i]["facility_id"]));

        }

    }

}

function getDistrictOffsets() {

    var svg = __$("map").contentDocument;

    var elements = ["chitipa", "karonga", "rumphi", "mzimba", "nkhatabay", "nkhotakota", "salima", "kasungu", "dedza",
        "lilongwe", "ntchisi", "ntcheu", "mchinji", "dowa", "balaka", "zomba", "machinga", "blantyre", "machinga",
        "chiradzulu", "chikwawa", "nsanje", "neno", "mwanza", "phalombe", "mulanje", "likoma", "thyolo", "mangochi"];

    for (var i = 0; i < elements.length; i++) {

        var element = svg.getElementById(elements[i]).getBBox();

        districtOffsets[elements[i]] = {
            'x': element.x,
            'y': element.y,
            'height': element.height,
            'width': element.width
        }
    }

}

setDefaults();
