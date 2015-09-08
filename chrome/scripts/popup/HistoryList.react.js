var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');
var HistoryListEntry = require('./HistoryListEntry.react.js');
var _ = require('underscore');

var HistoryList = React.createClass({
    mixins: [ParseReact.Mixin], // Enable query subscriptions

    observe(props, state) {
        var query = new Parse.Query('Urls');
        if (this.props.sortDirection == "ascending")
            query.ascending(this.props.sortBy);
        else
            query.descending(this.props.sortBy);
            
        return {
            items: query
        };
    },
 
    render: function() {
        
        return (
            <section id="historylist"> 
            <ul>
                {this.data.items.map(function(item) {
                    return <HistoryListEntry key={item.id} urlObject={item} />
                })}
            </ul>
            </section>
        );
    }
    
});

module.exports = HistoryList;
