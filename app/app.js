'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

var Dart380 = require('../lib/Dart380');
var Dart380ViewModel = require('./Dart380ViewModel');

$(function () {
    var view = $(document).find("body>div")[0];
    var viewModel = new Dart380ViewModel(new Dart380());
    ko.applyBindings(viewModel, view);
    viewModel.activate(view);
});
