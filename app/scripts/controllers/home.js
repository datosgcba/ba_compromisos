'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function ($scope,$timeout,$http,UrlService) {

    $scope.data = [];
    $scope.loading = true;
    $scope.charts = {};

    var url = UrlService.getUrl('home') + '&callback=JSON_CALLBACK';

    $http.jsonp(url)
    .success(function(data){
      $scope.data = data;
      $scope.loading = false;
      $scope.renderCharts();
      console.log(data);
    });

    $scope.renderCharts = function(){

      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();

    };

    function renderDateChart(){
      $scope.charts.date_chart = c3.generate({
          bindto: '#date_chart',
          data: {
              columns: [
                  ['data1', -30, 200, 200, 400, -150, 250],
                  ['data2', 130, 100, -100, 200, -150, 50],
                  ['data3', -230, 200, 200, -300, 250, 250]
              ],
              type: 'bar',
              groups: [
                  ['data1', 'data2']
              ]
          },
          grid: {
              y: {
                  lines: [{value:0}]
              }
          }
      });
    };

    function renderStateChart(){
      $scope.charts.state_chart = c3.generate({
          bindto: '#state_chart',
          data: {
              columns: [
                  ['data1', -30, 200, 200, 400, -150, 250],
                  ['data2', 130, 100, -100, 200, -150, 50],
                  ['data3', -230, 200, 200, -300, 250, 250]
              ],
              type: 'bar',
              groups: [
                  ['data1', 'data2']
              ]
          },
          grid: {
              y: {
                  lines: [{value:0}]
              }
          }
      });
    };

    function renderCategoryChart(){
      var diameter = $('#category_chart').parent().width(), //max size of the bubbles
        color    = d3.scale.category20b(); //color category

      var bubble = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .padding(1.5);

      var svg = d3.select("#category_chart")
          .append("svg")
          .attr("width", diameter)
          .attr("height", diameter)
          .attr("class", "bubble");

      var data = [
        {Fruit:'Banana','Amount':15},
        {Fruit:'Apple','Amount':30},
        {Fruit:'Pear','Amount':5}
      ];

      //convert numerical values from strings to numbers
      data = data.map(function(d){ d.value = +d["Amount"]; return d; });

      //bubbles needs very specific format, convert data to this.
      var nodes = bubble.nodes({children:data}).filter(function(d) { return !d.children; });

      //setup the chart
      var bubbles = svg.append("g")
          .attr("transform", "translate(0,0)")
          .selectAll(".bubble")
          .data(nodes)
          .enter();

      //create the bubbles
      bubbles.append("circle")
          .attr("r", function(d){ return d.r; })
          .attr("cx", function(d){ return d.x; })
          .attr("cy", function(d){ return d.y; })
          .style("fill", function(d) { return color(d.value); });

      //format the text for each bubble
      bubbles.append("text")
          .attr("x", function(d){ return d.x; })
          .attr("y", function(d){ return d.y + 5; })
          .attr("text-anchor", "middle")
          .text(function(d){ return d["Fruit"]; })
          .style({
              "fill":"white", 
              "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
              "font-size": "12px"
          });
    }


  });
