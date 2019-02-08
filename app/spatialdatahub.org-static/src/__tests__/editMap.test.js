// test/editMap.test.js
'use strict';

import { showPlaceContainer, getSelectedPlacePolygon } from '../pieces/editMap.js';
import L from 'leaflet';

describe('editMap.js file tests', () => {
    // Is this an extraneous function?
    // It seems to be toggling visibility
    describe('showPlaceContainer function', () => {
        // there should be a better way to mock stuff
        // I should be able to bring in a template to use. I will start by doing it the long way
        test('showPlaceContainer should change element display style from "" to "block"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            fixture.appendChild(element);

            // call function
            showPlaceContainer(element);

            // test to see that the function worked
            expect(element.getAttribute('style')).toBe('display: block;');
        });

        test('showPlaceContainer should change element display style from "none" to "block"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            fixture.appendChild(element);

            // set element style to "display: none"
            element.setAttribute('style', 'display: none');

            // call function
            showPlaceContainer(element);

            // test to see that the function worked
            expect(element.getAttribute('style')).toBe('display: block;');
        });
    });

    describe('getSelectedPlacePolygon', () => {
        // I should be importing these from their own files. 
        // triangle polygon
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
                    "properties": {},
                    "geometry": {
                        "type": "Point",
                        "coordinates": [
                            -4.482421875,
                            38.65119833229951
                        ]
                    }
                }
            ]
        };

        const polyLayer = L.geoJson(poly);
        const lineLayer = L.geoJson(line);
        const pointLayer = L.geoJson(point);

        test('getSelectedPlacePolygon should return "not a polygon" if given a point layer', () => {
            const arr = [pointLayer];
            expect(getSelectedPlacePolygon(arr)).toBe('not a polygon');
        });

        test('getSelectedPlacePolygon should return "not a polygon" if given a line layer', () => {
            const arr = [lineLayer];
            expect(getSelectedPlacePolygon(arr)).toBe('not a polygon');
        });

        // maybe not
        // it returns a featureCollection
        //      test('getSelectedPlacePolygon should return "Polygon" if given a polygon layer', () => {
        //          const arr = [polyLayer];
        //          expect(getSelectedPlacePolygon(arr)).toBe('not a polygon');
        //      });
    });
});
