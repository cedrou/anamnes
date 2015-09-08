var React = require('react');
var HistoryList = require('./HistoryList.react.js');

var History = React.createClass({
	
    getInitialState: function() {
        return ({
            sortBy: "title",
            sortDirection: "ascending"
        });
    },
    
    onClickTitle: function() {
        if (this.state.sortBy == "title") {
            this.setState({ sortBy: "title", sortDirection: (this.state.sortDirection == "ascending") ? "descending" : "ascending" });
        } else {
            this.setState({ sortBy: "title", sortDirection: "ascending" });
        }
    },
    
    onClickLastVisited: function() {
        if (this.state.sortBy == "lastAccessed") {
            this.setState({ sortBy: "lastAccessed", sortDirection: (this.state.sortDirection == "ascending") ? "descending" : "ascending" });
        } else {
            this.setState({ sortBy: "lastAccessed", sortDirection: "descending" });
        }
    },
    
    onClickTotalTime: function() {
        if (this.state.sortBy == "totalTime") {
            this.setState({ sortBy: "totalTime", sortDirection: (this.state.sortDirection == "ascending") ? "descending" : "ascending" });
        } else {
            this.setState({ sortBy: "totalTime", sortDirection: "descending" });
        }
    },
    
    render: function() {
        var titleSpan = <span onClick={this.onClickTitle}>title</span>;
        var lastVisitedSpan = <span onClick={this.onClickLastVisited}>last visited</span>;
        var totalTimeSpan = <span onClick={this.onClickTotalTime}>total time</span>;
        
        return (
            <div>
                <header>
                    <h1>Anamnes</h1>
                    <div>Sort by {titleSpan} | {lastVisitedSpan} | {totalTimeSpan}</div>
                </header>
                <HistoryList sortBy={this.state.sortBy} sortDirection={this.state.sortDirection} />
            </div>
        );
    }
});

module.exports = History;
