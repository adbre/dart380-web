'use strict';

var $ = require('jquery'),
    _ = require('lodash'),
    ko = require('knockout');

var Dart380ViewModel = require('./Dart380ViewModel');

$(function () {
    var view = $(document).find("body>div")[0];
    var viewModel = new Dart380ViewModel();
    ko.applyBindings(viewModel, view);
    viewModel.activate(view);
});
