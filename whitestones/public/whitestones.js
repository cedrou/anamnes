var Comments = React.createClass({
  mixins: [ParseReact.Mixin], // Enable query subscriptions

  observe: function() {
    // Subscribe to all Comment objects, ordered by creation date
    // The results will be available at this.data.comments
    return {
      comments: (new Parse.Query('Comment')).ascending('createdAt')
    };
  },

  render: function() {
      // Render the text of each comment as a list item
      return React.createElement(
          'ul',
          null,
          this.data.comments.map(function(c) {
              return React.createElement(
                  'li',
                  null,
                  c.text
              );
          })
      );
  }
});


var WhitestonesApp = React.createClass({
    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                'header',
                null,
                React.createElement(
                    'h1',
                    null,
                    'anamnes.io'
                )
            ),
            React.createElement(Comments, null)
        );
    }

});

React.render(React.createElement(WhitestonesApp), document.getElementById('main'));