// Basemap Layers
var DarkGray = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}');
var LightGray = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}'); 
var Streets = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}');  


// Cancer Tracts
function getCancerRateColor(d) {
    return d > .5 ? '#03045e' :
            d > .2  ? '#0077b6' :
                d > .1  ? '#00b4d8' :
                    d > .05  ? '#90e0ef' :
                        '#caf0f8';
}
function cancertractsColor(feature) {
    return {
        fillColor: getCancerRateColor(feature.properties.canrate),
        weight: 1,
        opacity: 1,
        color: '#d9d9d9',
        fillOpacity: 0.65
    };
};

// Create Cancer Tracts Layers
var cancertractsLG = L.esri.featureLayer({onEachFeature:onEachFeatureC,
    url:'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/cancer_tracts_zl/FeatureServer/0',
    style:cancertractsColor
});

function onEachFeatureC(feature, layer){
    layer.on({
        mouseover: highlightFeatureC,
        mouseout: resetHighlightC
    });
}
function highlightFeatureC(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1.5,
        color: '#d9d9d9',
        dashArray: '',
        fillOpacity: 0.7
    });
    // Show nitrate value in popup for current mouseover hex
    var popup = L.popup({closeButton:false})
    .setLatLng(e.latlng) 
    .setContent('<b>Cancer Rate: </b>' + (layer.feature.properties.canrate).toFixed(2).toString())
    .openOn(map);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightC(e) {
    cancertractsColor(e.target);
}

// Well Nitrate Points
var wellpointsColor = {
    radius: 3,
    fillColor: '#242424',
    color: "#242424",
    weight: 1,
    opacity: 1,
    fillOpacity: 0.9
};

// Create Well Points Layer
var wellpointsLG = L.esri.featureLayer({onEachFeature:onEachFeatureW,
    url:'https://services.arcgis.com/HRPe58bUyBqyyiCt/arcgis/rest/services/well_nitrate_zl/FeatureServer/0',
    style:nitrateLevelColor,
    pointToLayer: function(feature, latlng){
        return L.circleMarker(latlng, wellpointsColor);
    }
});

function onEachFeatureW(feature, layer){
    layer.on({
        mouseover: highlightFeatureW,
        mouseout: resetHighlightW
    });
}
function highlightFeatureW(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 1,
        color: '#242424',
        dashArray: '',
        fillOpacity: 0.7
    });
    // Show nitrate value in popup for current mouseover hex
    var popup = L.popup({closeButton:false})
    .setLatLng(e.latlng) 
    .setContent('<b>Nitrate Levels: </b>' + layer.feature.properties.nitr_ran.toFixed(3).toString() + ' ppm')
    .openOn(map);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightW(e) {
    wellpointsColor(e.target);
}

//IDW Nitrate Hex
function getNitrateRateColor(d) {
    return d > 10 ? '#d1890b' :
            d > 5  ? '#ff9d14' :
                d > 3  ? '#ffbd4d' :
                    d > 1   ? '#ffd866' :
                        d > 0  ? '#ffe466' :
                            '#ffffd4';
}
function nitrateLevelColor(feature) {
    return {
        fillColor: getNitrateRateColor(feature.properties.nitr_ran),
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.75
    };
};

// Create a layer for interpolating nitrate level surface
var nitrateratesIDW = L.geoJSON(null, {style:nitrateLevelColor, onEachFeature:onEachFeatureN});
console.log("interpolate layer created.")
// Mouseover event for showing popup and unit properties
function onEachFeatureN(feature, layer){
    layer.on({
        mouseover: highlightFeatureN,
        mouseout: resetHighlightN
    });
}
function highlightFeatureN(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    // Show nitrate value in popup for current mouseover hex
    var popup = L.popup({closeButton:false})
    .setLatLng(e.latlng) 
    .setContent('<b>Nitrate Levels: </b>' + layer.feature.properties.nitr_ran.toFixed(3).toString() + ' ppm</b>')
    .openOn(map);
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightN(e) {
    nitrateratesIDW.resetStyle(e.target);
}

//Regression Residuals
function getRegressionResidualColor(d){
    return d > .2 ? '"#933435' :
            d > .15  ? '#846158' :
                d > .1  ? '#e0a6ba' :
                    d > .05  ? '#f7cdd7' :
                        '#f8edf1';
}

function regressionResidualColor(feature){
    return {
        fillColor: getRegressionResidualColor(feature.properties.regError),
        weight: 1,
        opacity: .5,
        color: '#999999',
        fillOpacity: 0.85
    };
};

// Create a layer for mapping the regression error
var regressionresidualsLG = L.geoJSON(null, {style: regressionResidualColor, onEachFeature:onEachFeatureE});
console.log("Regression loaded.")
//mouseover event for showing popup and unit properties
function onEachFeatureE(feature, layer){
    layer.on({
        mouseover: highlightFeatureE,
        mouseout: resetHighlightE
    });
}
function highlightFeatureE(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });
    //show nitrate value in popup for current mouseover hex
    var popup = L.popup({closeButton:false})
        .setLatLng(e.latlng) 
        .setContent('<b>Nitrate Levels: </b>' + layer.feature.properties.nitrateMean.toFixed(3).toString() + ' ppm' +'<br>\
                    <b>Cancer Rate: </b>' + layer.feature.properties.canrate.toFixed(3).toString() + '<br>\
                    <b>Regression Error: </b>' + layer.feature.properties.regError.toFixed(3).toString())
        .openOn(map);
    // console.log(layer.feature.properties.nitr_ran)
    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
}
function resetHighlightE(e) {
    regressionresidualsLG.resetStyle(e.target);
}

//
var baseMaps = {
    "Streets": Streets,
    "Dark Gray": DarkGray,
    "Light Gray": LightGray    
};

var overlayMaps = {
    "Well Points": wellpointsLG,
    "Cancer Tracts": cancertractsLG,
    "Nitrate Levels": nitrateratesIDW,
    "Regression Residuals": regressionresidualsLG
}
//set the map map options
var map = L.map('map', {
    center: [44.8391, -90.89264],
    zoom: 7,
    minZoom: 7,
    maxZoom: 17,
    bounceAtZoomLimits: false,
    layers: [DarkGray, LightGray, Streets,  wellpointsLG, cancertractsLG, nitrateratesIDW, regressionresidualsLG]
});

var layers = L.control.layers(baseMaps, overlayMaps).addTo(map);

// end Map Layers

//Map Legends
var currentLegend;
var cancerTractsLegend = L.control({position: 'bottomright'});
function addLegend(){
    cancerTractsLegend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, .05, .1, .15, .2],
            labels = [];

        div.innerHTML = '<strong>Cancer Rate:</strong>' + '<br>';
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += 
                '<i style="background:' + getCancerRateColor(grades[i] + .05) + '"></i> ' +
                grades[i] + (grades[i + 1] ? ' - ' + grades[i + 1] + '<br>' : '+');
        }
        return div;
    };

    
    //initialize legend with tracts data
    cancerTractsLegend.addTo(map);
    //get current legend content
    currentLegend = $(".legend")[0];
}

addLegend();


//update legend when interpolate layer calculated
function updateNitrateLevelLegend() {
	currentLegend.innerHTML = '';
	var grades = [0, 1, 3, 5, 10],
		labels = [];

    currentLegend.innerHTML = '<strong>Nitrate Levels (ppm):</strong> ' + '<br>';
	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
        currentLegend.innerHTML += 
			'<i style="background:' + getNitrateRateColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' - ' + grades[i + 1] + '<br>' : '+');
	}   
};


// Update legend when regression calculated
function updateRegressionErrorLegend() {
    currentLegend.innerHTML = '';
    var grades = [0, .05, .1, .15, .2],
		labels = [];
 

    currentLegend.innerHTML = '<strong>Regression Error:</strong>' + '<br>';
	// loop through our density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
        currentLegend.innerHTML += 
			'<i style="background:' + getRegressionResidualColor(grades[i] + .05) + '"></i> ' +
            grades[i] + (grades[i + 1] ? ' - ' + grades[i + 1] + '<br>' : '+');
	}
};
//end Map Legends

// Analysis
var ddCoefficient, cellSize;
var nitrateHex;

// Interpolation when submitted
$('#interpolateBtn').click(async function (){
    await interpolate();
});

async function interpolate(){
    //get featureCollection from nitrate well layer
    wellpointsLG.query().run(function(error, featureCollection){
        if (error) {
            console.log(error);
            return;
        }
        //print the first well point to console for debugging purpose
//        console.log(featureCollection.features[0]);

        ddCoefficient = parseInt(document.getElementById("ddc").value);
        cellSize = parseInt(document.getElementById("cellsize").value);
        var options = {gridType: 'hex', property: 'nitr_ran', units: 'miles', weight: ddCoefficient};
        nitrateHex = turf.interpolate(featureCollection, cellSize, options);
        nitrateratesIDW.addData(nitrateHex);
    });
    updateNitrateLevelLegend();
}

$('#regressionBtn').click(async function(){
    await cancertonitrateinterpolation();
});

// Regression Process
// Aggregate nitrate level values to census tracts
var nitrateCentroids = [];
var aggregatedUnit;
async function cancertonitrateinterpolation(){
    // Check if nitrateHex is null
    if(nitrateHex == null){
        console.log(nitrateHex)
        return;
    }

    turf.featureEach(nitrateHex, function(currentFeature, featureIndex){
        var centroid = turf.centroid(currentFeature);
        centroid.properties = {nitr_ran:currentFeature.properties.nitr_ran};
        nitrateCentroids.push(centroid);
    });

    cancertractsLG.query().run(function(error, featureCollection){
        aggregatedUnit = turf.collect(featureCollection, turf.featureCollection(nitrateCentroids), 'nitr_ran', 'nitr_ran');
        RegressionError(aggregatedUnit);
    }); 
};
// Calculate Linear Regression
function calculateLinearRegression(units){
    if(units == null){
        console.log(units)
        return;
    }
    console.log(units)

    var values = [];
    turf.featureEach(units, function(currentFeature, featureindex){
        if(currentFeature.properties.nitr_ran.length > 0){
            var sum = 0;
            var counts = currentFeature.properties.nitr_ran.length;
            for (var i = 0; i < currentFeature.properties.nitr_ran.length; i++){
                sum += currentFeature.properties.nitr_ran[i];
            }
            var nitrateMean = sum/counts;

            // Add aggregated nitrate value to unit as property
            currentFeature.properties.nitrateMean = nitrateMean;

            // Add nitrate and cancer rate value pair within each unit to values array
            values.push([nitrateMean, currentFeature.properties.canrate]);
        }
    });

    // Calculate regression result from values array using simple statistics library
    var result = ss.linearRegression(values);
    console.log(result)

    return result;
}
// Calculate and map regression error
function RegressionError(units){
    var regressionResult = calculateLinearRegression(units);

    var m = regressionResult.m,
        b = regressionResult.b;

    // Show the regression equation result
    $('#slope').append(m.toFixed(4));
    $('#intercept').append(b.toFixed(4));

    turf.featureEach(units, function(currentFeature, featureindex){
        var estCancerRate = Number(m * currentFeature.properties.nitrateMean + b).toFixed(2);
        var regressionError = Math.abs(Number(currentFeature.properties.canrate) - estCancerRate);
        currentFeature.properties.regError = regressionError;
    })

    // Add Regression Residuals to map
    regressionresidualsLG.addData(units);
    updateRegressionErrorLegend();
};
//end 