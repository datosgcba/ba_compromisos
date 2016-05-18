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

    var pymChild = new pym.Child();

    $scope.data = [];
    $scope.loading = true;
    $scope.charts = {};

    var url = UrlService.getUrl('home') + '&callback=JSON_CALLBACK';

    $http.jsonp(url)
    .success(function(data){
      $scope.data = data;
      $scope.loading = false;
      $scope.renderCharts();
    });

    $scope.renderCharts = function(){

      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();

    };


    var showDetail= function(c){
      c.porcentaje =  Math.round(Math.floor(Math.random() * 99) + 2);
      $scope.$apply(function(){
        $scope.currentCompromise = c;  
      });
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
          axis: {
            x: {show:false},
            y: {show:false}
          },
          grid: {
              y: {
                  lines: [{value:0}]
              }
          }
      });
    }

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
          axis: {
            x: {show:false},
            y: {show:false}
          },
          grid: {
              y: {
                  lines: [{value:0}]
              }
          }
      });
    }

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
        {Fruit:'Banana',Amount:15},
        {Fruit:'Apple',Amount:30},
        {Fruit:'Pear',Amount:5}
      ];

      //convert numerical values from strings to numbers
      data = data.map(function(d){ 
        d.value = +d.Amount; return d; });

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
          .text(function(d){ return d.Fruit; })
          .style({
              "fill":"white", 
              "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
              "font-size": "12px"
          });
    }


    function renderMenuChart(){

      var itemSize = 150,
          gap = 5,
          w = $(window).width(),
          h = 500,
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

      function updateSvgSize(){

        $scope.charts.menu_chart.svg
          .transition()
          .duration(delay)
          .attr("width", w)
          .attr("height", h);

        //send update to frame
        pymChild.sendHeight();

      }

      function positionHome(){
        w = $(window).width();

        var xLimit = Math.floor(w/itemSize),
            xCount = 0,
            yCount = 0,
            xOffset = (w-(xLimit*itemSize))/2;

        h = Math.ceil(($scope.data.length/xLimit))*itemSize;

        updateSvgSize();

        $scope.charts.menu_chart.items_group
          .selectAll("g.compromiso-item")
          .transition()
          .duration(delay)
          .attr("transform", function(d,i) {
            var x = xCount*itemSize+xOffset;
            var y = yCount*itemSize;
            if(xCount<xLimit-1){
              xCount++;
            } else {
              xCount = 0;
              yCount++;
            }
            return "translate(" + x +"," + y + ")"; 
          });
      }

      function createCompromisos( ){

        var defaults = {
          "width": itemSize,
          "height": itemSize/3,
        };

        d3plus.textwrap()
          .config(defaults);

        $scope.charts.menu_chart.items_group
          .selectAll("g.compromiso-item")
          .data(data)
          .enter()
          .append('g')
          .classed('compromiso-item',true)
          .each(function(d) {

              var group = d3.select(this);

              //frame
              group
                .append('rect')
                .classed('compromiso-frame',true)
                .attr('x',0)
                .attr('y',0)
                .attr('height',itemSize)
                .attr('width',itemSize)
                .attr('fill','white');

              //text
              group
                .append('rect')
                .classed('compromiso-label-shape',true)
                .classed('shape',true)
                .attr('x',0)
                .attr('y',itemSize/3*2)
                .attr('height',itemSize/3)
                .attr('width',itemSize)
                .attr('fill','none');

              group
                .append('text')
                .classed('compromiso-label',true)
                .classed('wrap',true)
                .attr('id','c'+d.numero)
                .attr('opacity',0)
                .text(function(){
                  return d.titulo;
                });

              group
                .append("svg:image")
                .attr('x',itemSize/2-25)
                .attr('y',itemSize/3-25)
                .attr('width', 50)
                .attr('height', 50)
                .attr("xlink:href","images/building.svg");

              //rect frame
              group
                .append('rect')
                .classed('compromiso-action',true)
                .attr('x',gap)
                .attr('y',gap)
                .attr('height',itemSize-gap*2)
                .attr('width',itemSize-gap*2)
                .attr('stroke','#ccc')
                .attr('stroke-width','1')
                .attr('fill','transparent')
                .on("click", function(dd){
                  showDetail(d);
                });

          })
          .transition()
          .duration(0)
          .attr("transform", function(d,i) {
              var x = w/2-itemSize/2;
              var y = h/2-itemSize/2;
              return "translate(" + x +"," + y + ")"; 
          })
          .each("end", function(d){
            var t = d3.select('text#c'+d.numero);
            d3plus.textwrap()
              .container(t)
              .shape('square')
              .align('center')
              .valign('top')
              .padding(3)
              .draw();

            t.transition().attr('opacity',1);
          }); 

        };

        createCompromisos();

        setTimeout(function(){
          positionHome();
        },1000);

        var id;
        $(window).resize(function() {
            clearTimeout(id);
            id = setTimeout(function(){ 
              positionHome();
            }, 500);
        });

    }


  });
