// __tests__/mapFunctions.test.js
// this file does not test all the functions in the mapFunctions.js file
// asynchronous testing needs to be used for many of the functions
'use strict';

import { extSelect, latLngPointOnFeature, checkFeatureProperties, returnCorrectUrl } from '../pieces/mapFunctions';

// these should be imported from a separate file. maybe from the mocks section?
const poly = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -18.544921875,
                            29.53522956294847
                        ],
                        [
                            -8.9208984375,
                            22.30942584120019
                        ],
                        [
                            -9.31640625,
                            31.39115752282472
                        ],
                        [
                            -18.544921875,
                            29.53522956294847
                        ]
                    ]
                ]
            }
        }
    ]
};

const line = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        -13.9306640625,
                        33.87041555094183
                    ],
                    [
                        2.4609375,
                        27.72243591897343
                    ]
                ]
            }
        }
    ]
};

const point = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {
                "color": "blue"
            },
            "geometry": {
                "type": "Point",
                "coordinates": [
                    -4,
                    38
                ]
            }
        }
    ]
};

describe('mapFunctions.js file tests', () => {
    describe('extSelect function', () => {
        describe('should return correct "getDataset" function when given an extension and url', () =>{
            
        });
    });

    describe('latLngPointOnFeature function', () => {
        describe('should return html with the lat and lng coordinates', () => {
            test('should return <dt>Latitude:</dt> <dd>38</dd> for point feature latitude coordinate', () => {
                const expected = '<dt>Latitude:</dt> <dd>38</dd>';
                const pointLayer = L.geoJson(point, {
                    onEachFeature: (feature, layer) => {
                        expect(latLngPointOnFeature(feature)[0]).toBe(expected);
                    }
                });
            });

            test('should return <dt>Longitude:</dt> <dd>-4</dd> for point feature longitude coordinate', () => {
                const expected = '<dt>Longitude:</dt> <dd>-4</dd>';
                const pointLayer = L.geoJson(point, {
                    onEachFeature: (feature, layer) => {
                        expect(latLngPointOnFeature(feature)[1]).toBe(expected);
                    }
                });
            });

            test('should return [""] for line feature', () => {
                const expected = [""];
                const lineLayer = L.geoJson(line, {
                    onEachFeature: (feature, layer) => {
                        expect(latLngPointOnFeature(feature)).toEqual(expected);
                    }
                });
            });

            test('should return [""] for polygon feature', () => {
                const expected = [""];
                const polygonLayer = L.geoJson(poly, {
                    onEachFeature: (feature, layer) => {
                        expect(latLngPointOnFeature(feature)).toEqual(expected);
                    }
                });
            });
        });
    });

    describe('checkFeatureProperties', () => {
        describe('should return array of feature properties of a layer (geojson dataset)', () => {
            test('should return [ \'<dt>color</dt> <dd>blue</dd>\' ]', () => {
                const expected = ['<dt>color</dt> <dd>blue</dd>'];
                const pointLayer = L.geoJson(point, {
                    onEachFeature: (feature, layer) => {
                        expect(checkFeatureProperties(feature)).toEqual(expected);
                    }
                });
            });

            test('layer without properties should return [ \'No feature properties\' ]', () => {
                const expected = [];
                const lineLayer = L.geoJson(line, {
                    onEachFeature: (feature, layer) => {
                        expect(checkFeatureProperties(feature)).toEqual(expected);
                    }
                });
            });

        });
    });

    describe('returnCorrectUrl', () => {
        test('should take a link and return a url if there is a "url" attribute', () => {
            const fixture = document.createElement('div');
            const link = document.createElement('a');
            link.setAttribute('url', 'https://whatever.com');
            expect(returnCorrectUrl(link, 1)).toBe('https://whatever.com');
        });

        test('should return "/load_dataset/1" if given link without a url attribute but a pk of 1', () => {
            const fixture = document.createElement('div');
            const link = document.createElement('a');
            expect(returnCorrectUrl(link, 1)).toBe('/load_dataset/1');
        });
    });
});
