var d3 = require('d3')
var React = require('react')
var ReactDOM = require('react-dom')
var victory = require('victory')

d3.select('#root')
  .append('div')
  .attr('id', 'victoryContainer')
  .style('background-color', 'lightgreen')

d3.select('#root')
  .append('div')
  .attr('id', 'd3Container')
  .style('background-color', 'lightblue')

var useVictory = !true;
var dataCount = 1000;
var updateInterval = 100;

function getData() {
  var data = []
  for (var i = 0; i < dataCount; i++) {
    data.push({x: i, y: Math.round(Math.random() * 100)})
  }
  return data
}

function createVictory () {
  var Bar = React.createClass({
    componentDidMount: function () {
      var self = this
      setInterval(function () {
        self.setState({data: getData()})
      }, updateInterval)
    },

    getInitialState: function () {
      return {data: getData()}
    },

    render: function () {
      return (
        <victory.VictoryBar data={this.state.data}
          domain={{y: [0, 100]}}
          width={800}
          height={500}
          />
      )
    }
  })

  ReactDOM.render(<Bar/>, document.getElementById('victoryContainer'))
}

function createD3 () {
  var x = d3.scale.linear().domain([0, dataCount]).range([0, 800])
  var y = d3.scale.linear().domain([0, 100]).range([500, 0])
  var svg = d3.select('#d3Container').append('svg').attr('width', 800).attr('height', 500)
  svg.selectAll('g')
    .data(getData(), function (d) {
      return d.x
    })
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
      return 'translate(' + x(d.x) + ', ' + (500 - y(d.y)) + ')'
    })
    .append('rect')
    .style('fill', 'gray')
    .attr('width', 8)
    .attr('height', function (d) {
      return y(d.y)
    })

  setInterval(function () {
    svg.selectAll('g')
      .data(getData())
      .attr('transform', function (d, i) {
        return 'translate(' + x(d.x) + ', ' + (500 - y(d.y)) + ')'
      })
      .select('rect')
      .attr('height', function (d) {
        return y(d.y)
      })
  }, updateInterval)
}

if (useVictory) {
  createVictory()
} else {
  createD3()
}
