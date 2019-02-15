// test/basic.test.js
'use strict';

import { classToggle,
         classToggleOnDiffLink,
         getExt,
         addButton
       } from '../pieces/basic.js';

describe('basic.js file tests', () => {
    describe('classToggle function', () => {
        // there should be a better way to mock stuff
        // I should be able to bring in a template to use. I will start by doing it the long way

        test('classToggle can add class "cheese" to element without a class', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            element.setAttribute('id', 'element');
            fixture.appendChild(element);

            // test the function
            classToggle(element, 'cheese');
            expect(element.getAttribute('class')).toBe('cheese');
        });

        test('classToggle can add class "cheese" to element that already has classes', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            element.setAttribute('class', 'nacho');
            element.setAttribute('id', 'element');
            fixture.appendChild(element);

            // test the function
            expect(element.getAttribute('class')).toBe('nacho');
            classToggle(element, 'cheese');
            expect(element.getAttribute('class')).toBe('nacho cheese');
        });

        test('classToggle can remove class "cheese" from element that has class "cheese"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            element.setAttribute('class', 'cheese');
            element.setAttribute('id', 'element');
            fixture.appendChild(element);

            // test the function
            expect(element.getAttribute('class')).toBe('cheese');
            classToggle(element, 'cheese');
            expect(element.getAttribute('class')).toBe('');
        });

        test('classToggle can remove class "cheese" from element that has class "nacho cheese"', () => {
            // mock the document
            const fixture = document.createElement('div');
            fixture.setAttribute('id', 'fixture');
            const element = document.createElement('div');
            element.setAttribute('class', 'nacho cheese');
            element.setAttribute('id', 'element');
            fixture.appendChild(element);

            // test the function
            expect(element.getAttribute('class')).toBe('nacho cheese');
            classToggle(element, 'cheese');
            expect(element.getAttribute('class')).toBe('nacho');
        });
    });

    describe('classToggleOnDiffLink function', () => {
        test('classToggleOnDiffLink removes class "nacho" from el1 when el2 is activated', () => {
            // mock the document
            const fixture = document.createElement('fixture');
            const el1 = document.createElement('div');
            const el2 = document.createElement('div');
            el1.setAttribute('class', 'nacho');
            fixture.appendChild(el1);
            fixture.appendChild(el2);
            const elements = [el1, el2];

            // test the function
            classToggleOnDiffLink(el2, elements, 'nacho');
            expect(el1.getAttribute('class')).toBe('');
        });

        test('classToggleOnDiffLink adds class "nacho" from el1 when el2 is activated', () => {
            // mock the document
            const fixture = document.createElement('fixture');
            const el1 = document.createElement('div');
            const el2 = document.createElement('div');
            el1.setAttribute('class', '');
            fixture.appendChild(el1);
            fixture.appendChild(el2);
            const elements = [el1, el2];

            // test the function
            classToggleOnDiffLink(el1, elements, 'nacho');
            expect(el1.getAttribute('class')).toBe('nacho');
        });
    });

    describe('getExt function', () => {
        test('getExt function returns "kml" from string ending in "kml" (case-insensitive)', () => {
            const caps = 'nachos.KML';
            const lower = 'nachos.kml';
            const mixed = 'nachos.kMl';

            // test the function
            expect(getExt(caps)).toBe('kml');
            expect(getExt(lower)).toBe('kml');
            expect(getExt(mixed)).toBe('kml');
        });

        test('getExt function returns "csv" from string ending in "csv" (case-insensitive)', () => {
            const caps = 'nachos.CSV';
            const lower = 'nachos.csv';
            const mixed = 'nachos.cSv';

            // test the function
            expect(getExt(caps)).toBe('csv');
            expect(getExt(lower)).toBe('csv');
            expect(getExt(mixed)).toBe('csv');
        });
        
        test('getExt function returns "tsv" from string ending in "tsv" or "txt" (case-insensitive)', () => {
            const caps_tsv = 'nachos.TSV';
            const lower_tsv = 'nachos.tsv';
            const mixed_tsv = 'nachos.tSv';
            const caps_txt = 'nachos.TXT';
            const lower_txt = 'nachos.txt';
            const mixed_txt = 'nachos.txt';

            // test the function
            expect(getExt(caps_tsv)).toBe('tsv');
            expect(getExt(lower_tsv)).toBe('tsv');
            expect(getExt(mixed_tsv)).toBe('tsv');
            expect(getExt(caps_txt)).toBe('tsv');
            expect(getExt(lower_txt)).toBe('tsv');
            expect(getExt(mixed_txt)).toBe('tsv');
        });

        test('getExt function returns "geojson" from string ending in "json" or "geojson" (case-insensitive)', () => {
            const caps_json = 'nachos.JSON';
            const lower_json = 'nachos.json';
            const mixed_json = 'nachos.JsOn';
            const caps_geojson = 'nachos.GEOJSON';
            const lower_geojson = 'nachos.geojson';
            const mixed_geojson = 'nachos.GeOjSoN';

            // test the function
            expect(getExt(caps_json)).toBe('geojson');
            expect(getExt(lower_json)).toBe('geojson');
            expect(getExt(mixed_json)).toBe('geojson');
            expect(getExt(caps_geojson)).toBe('geojson');
            expect(getExt(lower_geojson)).toBe('geojson');
            expect(getExt(mixed_geojson)).toBe('geojson');
        });
    });

    // should I get rid of this function?
    describe('addButton function', () => {
        test('addButton adds button to element', () => {
            const fixture = document.createElement('div');
            const btn = addButton('hey now now', 'blue', fixture);
            expect(btn).toBe(fixture.childNodes[0]);
        });

        test('addButton should have specific text', () => {
            const fixture = document.createElement('div');
            const btn = addButton('hey now now', 'blue', fixture);
            expect(fixture.childNodes[0].value).toBe('hey now now');
        });

        test('addButton should have specific text color', () => {
            const fixture = document.createElement('div');
            const btn = addButton('hey now now', 'blue', fixture);
            expect(fixture.childNodes[0].style.color).toBe('blue');
        });

        test('addButton should have specific font weight', () => {
            const fixture = document.createElement('div');
            const btn = addButton('hey now now', 'blue', fixture);
            expect(fixture.childNodes[0].style.fontWeight).toBe('bold');
        });
    });
});
