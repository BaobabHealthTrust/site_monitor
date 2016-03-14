/**
 * Created by chimwemwe on 2/26/16.
 */

var refPoints = [-9.331537, -17.158189, 32.674051, 35.969950];
var offsets = [10, 295, 10, 710];
var limits = [305, 720];
var previous;
var uCoords = {};

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

function __$(id) {

    return document.getElementById(id);

}

function latLon2Coord(lat, lon) {

    var x, y;

    x = ((offsets[1] - offsets[0]) * ((Math.abs(lon) - Math.abs(refPoints[2])) / (Math.abs(refPoints[3]) - Math.abs(refPoints[2])))) // + offsets[0];

    y = ((offsets[3] - offsets[2]) * ((Math.abs(lat) - Math.abs(refPoints[0])) / (Math.abs(refPoints[1]) - Math.abs(refPoints[0])))) // + offsets[2];

    return [x, y]

}

function resize() {

    if (__$("cell-0-0")) {

        __$("cell-0-0").style.height = (window.innerHeight - 20) + "px";

        __$("cell-0-0").style.width = ((window.innerWidth / 2) - 10) + "px";

    }

    if (__$("cell-0-1")) {

        __$("cell-0-1").style.height = ((window.innerHeight) - 20) + "px";

        __$("cell-0-1").style.width = ((window.innerWidth / 2) - 10) + "px";

    }

    if (__$("cell-1-1")) {

        __$("cell-1-1").style.position = "absolute";

        __$("cell-1-1").style.left = "12px";

        __$("cell-1-1").style.bottom = "10px";

        __$("cell-1-1").style.border = "2px solid #f00";

        __$("cell-1-1").style.height = ((window.innerHeight / 4) + 50) + "px";

        __$("cell-1-1").style.width = ((window.innerWidth / 4) - 50) + "px";

    }

}

function setDefaults() {

    var svg = __$("map").contentDocument;

    if (svg == null) {

        setTimeout("setDefaults()", 200);

        return;

    }

    loadStats("chitipa");

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

    randomLoad();
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

    circle.setAttribute("stroke", "rgba(0,0,0,0.4)");

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

    circle.setAttribute("stroke", "rgba(0,0,0,0.4)");

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

var globalTmrHnd;

function drawBorder(district) {

    clearTimeout(globalTmrHnd);

    var svg = __$("map").contentDocument;

    if (svg.getElementById('rect' + district)) {

        unloadDistrictSites(district);

        svg.getElementById("malawi").removeChild(svg.getElementById('rect' + district));

    } // else {


    loadStats(district);

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

    __$("district").outerHTML = __$("district").outerHTML.replace(/data="(.+?)"/, 'data="/images/mw/' + district + '.svg"')

    if (previous != undefined) {
        unloadDistrictSites(previous);
    }

    previous = district;

    loadDistrictSites(district);

    setTimeout("loadDistrictSitesByOffsets('" + district + "')", 500);

    if (__$("national_label")) {

        __$("national_label").innerHTML = names[district];

    }

    if (__$("district_label")) {

        __$("district_label").innerHTML = names[district];

    }

    globalTmrHnd = setTimeout(function(){
        randomLoad();
    }, 5000);

    // }

}

function loadDistrictSitesByOffsets(district) {

    var target = sites_by_zones[district];

    for (var i = 0; i < target.length; i++) {

        var result = latLon2Coord(target[i]["latitude"], target[i]["longitude"])

        var colors = ["rgba(200,200,200,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

        if(activeFacilities && activeFacilities.indexOf(target[i]["facility"]) >= 0) {

            colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

            var pos = 0;    // Math.round((Math.random() * 10)) % 3;

            insertSiteByOffset(result[0], result[1], colors[pos], district + '_' + target[i]["facility_id"], district);

        }

    }

}

function loadDistrictSites(district) {

    var target = sites_by_zones[district];

    for (var i = 0; i < target.length; i++) {

        var result = latLon2Coord(target[i]["latitude"], target[i]["longitude"])

        var colors = ["rgba(200,200,200,0.1)", "rgba(0,200,0,0.1)", "rgba(0,0,200,0.1)"];

        if(activeFacilities && activeFacilities.indexOf(target[i]["facility"]) >= 0) {

            colors = ["rgba(255,0,0,0.9)", "rgba(0,200,0,0.9)", "rgba(0,0,200,0.9)"];

            var pos = 0;    // Math.round((Math.random() * 10)) % 3;

            insertSite(result[0], result[1], colors[pos], target[i]["facility_id"]);

        }

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

function loadStats(district) {

    if (__$("cell-0-1")) {

        __$("cell-0-1").innerHTML = "";

        var table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        table.cellPadding = "5";
        table.border = 1;
        table.style.fontSize = "20px";
        table.style.color = "#fff";
        table.style.border = "1px solid #333";

        __$("cell-0-1").appendChild(table);

        var trh = document.createElement("tr");

        table.appendChild(trh);

        var th = document.createElement("th");
        th.innerHTML = names[district] + " District Attendance Statistics";
        th.colSpan = "4";
        th.style.backgroundColor = "#ccc";
        th.style.color = "#666";
        th.style.fontSize = "24px";

        trh.appendChild(th);

        var tr = document.createElement("tr");
        tr.style.backgroundColor = "#666";

        table.appendChild(tr);

        var th0 = document.createElement("th");
        th0.innerHTML = "Facility";
        th0.style.width = "20%";

        tr.appendChild(th0);

        var th1 = document.createElement("th");
        th1.innerHTML = "Today";
        th1.style.width = "20%";

        tr.appendChild(th1);

        var th2 = document.createElement("th");
        th2.innerHTML = "This Month";
        th2.style.width = "20%";

        tr.appendChild(th2);

        var th3 = document.createElement("th");
        th3.innerHTML = "This Year";
        th3.style.width = "20%";

        tr.appendChild(th3);

        var tbody = document.createElement("tbody");
        tbody.id = "tbody";
        tbody.style.color = "#333";
        tbody.style.fontSize = "18px";

        table.appendChild(tbody);

        queryByDistrict(district);

    }

}

function queryByDistrict(district) {

    var target = sites_by_zones[district];

    for (var i = 0; i < target.length; i++) {

        // console.log(target[i]["facility"]);

        if (__$("tbody") && activeFacilities && activeFacilities.indexOf(target[i]["facility"]) >= 0) {

            var tr = document.createElement("tr");

            __$("tbody").appendChild(tr);

            var td0 = document.createElement("td");
            td0.innerHTML = decodeURI(target[i]["facility"].replace(/\+/g, " ").replace(/\%\d+[A-Z]/g, ""));
            td0.style.overflow = "hidden";

            tr.appendChild(td0);

            displayFacilityStats(tr, target[i]["facility"]);

        }

    }

}

function padZeroes(num, zeros) {

    if(String(num).trim().length < zeros) {

        var pad = "";

        for(var i = 0; i < (zeros - String(num).trim().length); i++) {

            pad += "0";

        }

        return pad + String(num).trim();

    } else {

        return String(num).trim();

    }

}

function displayFacilityStats(control, facility) {

    if (!control || !facility) {

        return;

    }

    var url = "/query_site/" + encodeURI(facility.toLowerCase());

    var httpRequest;
    if (window.XMLHttpRequest) {
        httpRequest = new XMLHttpRequest();
    }

    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {

            if (httpRequest.responseText.trim().length > 0) {

                var json = JSON.parse(httpRequest.responseText);

                for(var i = 0; i < Object.keys(json).length; i++) {

                    var td = document.createElement("td");
                    td.style.textAlign = "center";
                    td.style.color = "#333";

                    switch(i) {

                        case 0:

                            td.innerHTML = json['today'];

                            break;

                        case 1:

                            td.innerHTML = json['this_month'];

                            break;

                        case 2:

                            td.innerHTML = json['this_year'];

                            break;

                    }

                    control.appendChild(td);

                }

            }

        }
    }
    httpRequest.open("GET", url, true);
    httpRequest.send();

}

function randomLoad() {

    var keys = Object.keys(names);

    var pos = Math.round(Math.random() * (keys.length - 1), 0);

    drawBorder(keys[pos]);

};

document.body.onload = function () {

    resize();

    setDefaults();

}

document.body.onresize = function () {

    resize();

}
