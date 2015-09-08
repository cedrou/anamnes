var Parse = require('parse').Parse;
var React = require('react');
var History = require('./History.react.js');

// Initialize Parse 
Parse.initialize('ElGYGALqbwqrM4GBrRKxjK2MRZ1cOZq2Bq3Xi0Ko', 'CwMUO32jiUfarcgZdScIcSOT9LIV9Dpm1U9aAATc');

React.render( 
    <History />, 
    document.getElementById('main')
);