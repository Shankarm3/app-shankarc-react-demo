function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

var Counter = React.createClass({
  getInitialState: function() {
    return {
      count: 0
    };
  },

  onCounterClick: function(evt) {
    this.setState({
      count: this.state.count + 1
    });
  },
  
//   shouldComponentUpdate: function(nextProps, nextState) {
//     return (
//       nextState.count !== this.state.count ||
//       shallowEqual(nextProps, this.props)
//     );
//   },

  render: function() {
    console.log('rendering');
    return (
      <div {...this.props}>
        <div>Clicks: {this.state.count}</div>
        <button onClick={this.onCounterClick}>Increment</button>
      </div>
    );
  }
});

var CounterWrapper = React.createClass({
  getInitialState: function() {
    return {
      showborder: false,
    };
  },
  
  onToggleBorderClick: function() {
    this.setState({
      showborder: !this.state.showborder,
    });
  },
  
  render: function() {
    var style = {
      marginBottom: '20px'
    };
    if (this.state.showborder) {
      style.border = '1px solid #64994A';
    }
    return (
      <div>
        <Counter style={style} />
        <button onClick={this.onToggleBorderClick}>Toggle Border</button>
      </div>
    );
  }
});

ReactDOM.render(
  <CounterWrapper />,
  document.getElementById('container')
);