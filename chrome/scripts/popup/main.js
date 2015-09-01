var React = require('react');
var History = require('./History.react.js');
var App = require('../common/App.js');

var app = new App();

React.render( 
    <History app={app} />, 
    document.getElementById('main')
);