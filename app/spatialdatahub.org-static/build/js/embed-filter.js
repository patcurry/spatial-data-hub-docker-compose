(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
'use strict';

// here i have to make a filter function that relies on the url
// this needs to be put into the main bundle.js so that it has access
// to all the variables. these things need to be made into functions that
// run only at specific times. How can I make that happen?

// get map

// get dataset

// get url filter string
// I don't like the way that I have to write this, but it works, which is the
// most important thing.
var getDatasetFilterParamValue = function getDatasetFilterParamValue() {
    var urlParams = new URLSearchParams(window.location.search);
    var response = void 0;
    urlParams.forEach(function (value, key) {
        if (key === 'f') {
            response = value;
        }
    });
    return response;
};

console.log(getDatasetFilterParamValue());

// the key can be whatever... maybe name or something there should be a
// default value that just shows all data.

},{}]},{},[1]);
