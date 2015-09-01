var Parse = require('parse').Parse;
// ParseReact sits on top of your Parse singleton
var ParseReact = require('parse-react');
var React = require('react');
var ParseComponent = require('parse-react/class')

var HistoryListEntry = require('./HistoryListEntry.react.js');
var _ = require('underscore');

var HistoryList = React.createClass({

    observe(props, state) {
        return {
        items: new Parse.Query('SiteAccess').ascending('createdAt')
        };
    },

    render: function() {
        //var entries = Array.prototype.slice.call(this.props.app.entries).reverse();
        var items = _.sortBy(this.props.app.parseItems, 'lastActivated').reverse();
        
        return (
            <section id="historylist">
                <ul>
                    {items.map(function(item) {
                        return <HistoryListEntry entry={item} />
                    })}
                </ul>
            </section>
        );
    }
    
});

module.exports = HistoryList;
