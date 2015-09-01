var React = require('react');
var HistoryList = require('./HistoryList.react.js');

var History = React.createClass({
	getInitialState: function() {
		return {'app': this.props.app};
	},

    onUpdate: function() {
		this.setState({"app": this.props.app});
	},


    render: function() {
        return (
            <div>
                <header><h1>anamnes.io</h1></header>
                <HistoryList app={this.state.app} onUpdate={this.onUpdate}/>
            </div>
        );
    }
});

module.exports = History;
