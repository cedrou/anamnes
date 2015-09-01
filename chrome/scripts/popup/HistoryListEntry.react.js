var React = require('react');

var HistoryListEntry = React.createClass({
    render: function() {
        var date = new Date(this.props.entry.lastActivated).toFormattedString();
        return (
            <li className={this.className}>
                <div>
                    <img className="icon" src={"chrome://favicon/" + this.props.entry.url}></img>
                    <span className="title">{this.props.entry.title}</span>
                </div>
                <div className="url">{this.props.entry.url}</div>
                <div className="date">Last view: {date}</div>
                <div className="total-time">Total time: {this.props.entry.totalTime}</div>                
            </li>
        );
    }
});

module.exports = HistoryListEntry;
