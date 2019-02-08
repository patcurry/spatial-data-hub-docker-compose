const L = require('leaflet');
const omnivore = require('@mapbox/leaflet-omnivore');

// /////////// //
// mapFunctions.js //
// /////////// //

// should these functions be rewritten?
// How can I make them take only one arg each?
// That wouldn't work, because I have to take both the url,
// and the ext as arguements.

// I could just use the ext, to decide which one of the url

// 1) promisified omnivore functions
// these should probably be refactored
// they don't need to be exposed to the rest of the code base
// they are only used here
const getGeoJSON = function (url) {
    return new Promise(function handlePromise (resolve, reject) {
        const dataLayer = omnivore.geojson(url)
              .on('ready', () => resolve(dataLayer))
              .on('error', () => reject(Error('Either a url problem or the file cannot be parsed')));
    });
};

const getKML = function (url) {
    return new Promise(function handlePromise (resolve, reject) {
        const dataLayer = omnivore.kml(url)
              .on('ready', () => resolve(dataLayer))
              .on('error', () => reject(Error('Either a url problem or the file cannot be parsed')));
    });
};

const getCSV = function (url) {
    return new Promise(function handlePromise (resolve, reject) {
        const dataLayer = omnivore.csv(url, {
            delimiter: ','
        })
              .on('ready', () => resolve(dataLayer))
              .on('error', () => reject(Error('Either a url problem or the file cannot be parsed')));
    });
};

const getTSV = function (url) {
    return new Promise(function handlePromise (resolve, reject) {
        const dataLayer = omnivore.csv(url, {
            delimiter: '\t'
        })
              .on('ready', () => resolve(dataLayer))
              .on('error', () => reject(Error('Either a url problem or the file cannot be parsed')));
    });
};


// 2) function to choose which omnivore function to run
// should I write getCSV getKML and getGeoJSON as object
// methods and call them?
const extSelect = function (ext, url) {
    console.log(ext);
    const prom = ext === 'kml'
          ? getKML(url)
          : ext === 'csv'
          ? getCSV(url)
          : ext === 'tsv'
          ? getTSV(url)
          : getGeoJSON(url);
    return prom;
};

// I need to make a nice looking popup background that scrolls
// why isn't this in the add popups function?
// innerHTML doesn't work on this, because it's still a string in this document
// just make it part of the set content thing
//const popupHtml = '<dl id="popup-content"></dl>'

// add popups to the data points
// should this function be called every time a layer is added to a map?
// or will the layer still have the popups after it's toggled off and on?

const checkFeatureProperties = function (feature) {
    return Object.keys(feature.properties)
        .map(key => `<dt>${key}</dt> <dd>${feature.properties[key]}</dd>`);
};

const latLngPointOnFeature = function (feature) {
    return feature.geometry.type === 'Point'
        ? [
            `<dt>Latitude:</dt> <dd>${feature.geometry.coordinates[1]}</dd>`,
            `<dt>Longitude:</dt> <dd>${feature.geometry.coordinates[0]}</dd>`
        ]
        : [''];
};

const addPopups = function (feature, layer) {
    const popupContent = checkFeatureProperties(feature)
          .concat(latLngPointOnFeature(feature))
          .map(x => x);

    const content = `<dl id="popup-content">${popupContent.join('')}</dl>`;
    const popup = L.popup().setContent(content);

    layer.bindPopup(popup);
};


// THESE THREE CONTROL FUNCTIONS ARE TIGHTLY COUPLED WITH DIFFERENT THINGS
// THEY WILL HAVE TO BE CHANGED EVENTUALLY
// ZMT watermark by extending Leaflet Control
L.Control.Watermark = L.Control.extend({
    onAdd: (map) => {
        const img = L.DomUtil.create('img');
        // this will have to be changed relative to the site for production
        img.src = 'https://s3.eu-central-1.amazonaws.com/spatialdatahub-static/images/zmt_logo_blue_black_100px.png';
        // img.src = imgSrc
        img.style.width = '100px';
        return img;
    },
    onRemove: (map) => {
        // Nothing to do here
    }
});

// Home button by extending Leaflet Control
L.Control.HomeButton = L.Control.extend({
    onAdd: (map) => {
        const container = L.DomUtil.create('div',
                                           'leaflet-bar leaflet-control leaflet-control-custom');
        //  container.innerHTML = '<i class="fa fa-home fa-2x" aria-hidden="true"></i>'
        container.style.backgroundImage = 'url("https://s3.eu-central-1.amazonaws.com/spatialdatahub-static/images/home_icon.png")';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundColor = 'white';
        container.style.width = '34px';
        container.style.height = '34px';
        container.addEventListener('click', () => map.setView({lat: 0, lng: 0}, 1));
        return container;
    },
    onRemove: (map) => {
        // Nothing to do here
    }
});

// scroll wheel toggle button
L.Control.ToggleScrollButton = L.Control.extend({
    onAdd: (map) => {
        const container = L.DomUtil.create('div',
                                           'leaflet-bar leaflet-control leaflet-control-custom');
        // container.style.backgroundImage = 'url("http://localhost:8000/static/images/mouse.png")'
        container.style.backgroundImage = 'url("https://s3.eu-central-1.amazonaws.com/spatialdatahub-static/images/mouse.png")';
        container.style.backgroundRepeat = 'no-repeat';
        container.style.backgroundColor = 'white';
        container.style.width = '34px';
        container.style.height = '34px';
        container.addEventListener('click', () => {
            map.scrollWheelZoom.enabled()
                ? map.scrollWheelZoom.disable()
                : map.scrollWheelZoom.enable();
        });
        return container;
    },
    onRemove: (map) => {
        // Nothing to do here
    }
});

// ////////////// //
// datasetList.js //
// ////////////// //
// should this stuff just be in the mapFunctions file? Yes
const returnCorrectUrl = function (link, pk) {
    return link.getAttribute('url')
        ? link.getAttribute('url')
        : `/load_dataset/${pk}`;
};

const filterLayer = function (geoJsonFeature, filterParams) {
    // search one field at a time.
    // what if the field key has uppercase letters or other things?
    // put quotes around it
    // how can I search the field?
    // how do I add an or/and statement?
//    console.log(filterParams);
    let answer;
    //if (filterParams !== null) {
    if (filterParams !== 'undefined' && filterParams.length > 0) {
        // if filter is not null then it is an array
        // if any item in the array fits the criteria
        // return true, not an array
        answer = filterParams.map(f => {
  	    // remove quotes around string (if they are there)
	    const k = f.key.replace(/['"]+/g, '');
	    const v = f.value.replace(/['"]+/g, '');
	    return geoJsonFeature.properties[k]
	        .toLowerCase()
	        .includes(v.toLowerCase());
        }).includes(true);
    } else {
	answer = true;
    }
    return answer;
};

const returnLayer = function (color, markerOptions, filter=null) {
    return L.geoJSON(null, {
        // set the points to little circles
        pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, markerOptions);
        },
        filter: geoJsonFeature => filterLayer(geoJsonFeature, filter),
        onEachFeature: (feature, layer) => {
            // make sure the fill is the color
            layer.options.fillColor = color;
            // and make sure the perimiter is black (if it's a point) and the color otherwise
            feature.geometry.type === 'Point'
                ? layer.options.color = 'black'
                : layer.options.color = color;
            // add those popups
            //popupCallback(feature, layer);
            addPopups(feature, layer); // this comes from the index_maps.js file
        }
    });
};

const returnCluster = function (color) {
    return L.markerClusterGroup({
        iconCreateFunction: cluster => {
            const textColor = color === 'blue' || color === 'purple' || color === 'green'
                  ? 'white'
                  : 'black';
            return L.divIcon({
                html: `<div style="text-align: center; background-color: ${color}; color: ${textColor}"><b>${cluster.getChildCount()}</b></div>`,
                iconSize: new L.Point(40, 20)
            });
        }
    });
};

const layerLoadOrOnMap = function (map, container, key, callback) {
    return container[key]
        ? map.hasLayer(container[key])
        ? map.removeLayer(container[key]) 
        : map.addLayer(container[key])
    : callback; // this should have all the .then statements in it
}; 


module.exports = {
    getGeoJSON: getGeoJSON,
    getKML: getKML,
    getCSV: getCSV,
    getTSV: getTSV,
    //  handlePromiseLayer: handlePromiseLayer,
    extSelect: extSelect,
    checkFeatureProperties: checkFeatureProperties,
    latLngPointOnFeature: latLngPointOnFeature, 
    addPopups: addPopups,
    returnCorrectUrl: returnCorrectUrl,
    returnLayer: returnLayer,
    returnCluster: returnCluster,
    layerLoadOrOnMap: layerLoadOrOnMap
    //  handleDatasetLink: handleDatasetLink
};


