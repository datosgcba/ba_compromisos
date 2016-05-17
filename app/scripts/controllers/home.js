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


    function renderMenuChart(){

      var itemSize = 100,
          gap = 15,
          w = $(window).width(),
          h = 300,
          delay = 500;

      var data = angular.copy($scope.data);

      if(!$scope.charts.menu_chart){
        $scope.charts.menu_chart = {};
        $scope.charts.menu_chart.svg = d3.select("#menu_chart")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("class", "menu_chart");

        $scope.charts.menu_chart.items_group = $scope.charts.menu_chart.svg.append('g').classed('items-container',true);
        $scope.charts.menu_chart.labels_group = $scope.charts.menu_chart.svg.append('g').classed('labels-container',true);
      }
      
      //Chart elements
      var chart = $scope.charts.menu_chart;

      createCompromisos($scope.data);

      function createCompromisos(list){

        $scope.charts.menu_chart.items_group
          .selectAll("g.compromiso.item")
          .data(data)
          .enter()
          .append('g')
          .classed('compromiso-item',true)
          .each(function(d, i) {
              d3.select(this)
                .selectAll('text.compromiso-label')
                .data([d])
                .enter()
                .append('text')
                .classed('compromiso-label',true)
                .text(function(dd){
                  return dd.titulo;
                });
          })
          .transition()
          .duration(delay)
          .attr("transform", function(d,i) { 
            var x = 0, y=(i+1)*gap;
            return "translate(" + x +"," + y + ")"; }); 

          }

      function renderCompromisoList(position,max,list){

      }

    };


  });
