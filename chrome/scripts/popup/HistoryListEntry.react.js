var Parse = require('parse').Parse;
var ParseReact = require('parse-react');
var React = require('react');
var PrettyDate = require('./PrettyDate.react.js')
var _ = require('underscore');
var moment = require('moment');

var HistoryListEntry = React.createClass({
  
    render: function() {
        
        var lastVisited = moment(this.props.urlObject.lastAccessed).fromNow();
        var totalTime = moment.duration(this.props.urlObject.totalTime).humanize();
        
        return (
            <li className={this.className}>
                <div>
                    <img className="icon" src={"chrome://favicon/" + this.props.urlObject.url}></img>
                    <span className="title">{this.props.urlObject.title}</span>
                </div>
                <div className="url">{this.props.urlObject.url}</div>
                <div className="date">Last visited {lastVisited}</div>
                <div className="total-time">Total time {totalTime}</div>                
            </li>
        );
    }
});

module.exports = HistoryListEntry;
