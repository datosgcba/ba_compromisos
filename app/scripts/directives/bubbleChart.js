'use strict';

angular.module('compromisosSiteApp')
.directive('bubbleChart', function() {
    return {
        restrict: 'E',
        replace: false,
        scope: {
          container: '=container',
          config: '=config',
          data: '=bubbles'
        },
        controller: function($scope, $http) {

          $scope.id = $scope.container + '-directive'

          $scope.chart = null;

          function render(){

              var diameter = 350;

              var pad = ($('#'+$scope.id).width()-diameter) / 2;

              if($('#'+$scope.id).width()<diameter){
                diameter = $('#'+$scope.id).width();
                pad = 0;
              }

              var pack = d3.layout.pack()
                .sort(null)
                .size([diameter, diameter])
                .padding(5)
                .value(function(d) { 
                  return parseInt(d.value); 
                });

              //setup the chart
              if(!$scope.chart){
                
                $scope.chart = {};
                
                $scope.chart.svg = 
                  d3.select("#"+$scope.id)
                    .append("svg")
                    .attr("class", "bubble-container")
                    .attr("width", $('#'+$scope.id).width())
                    .attr("height", diameter);

                $scope.chart.mainGroup = $scope.chart.svg
                  .append('g')
                  .classed('main',true);
                  
              }

              $scope.chart.svg.attr("width", $('#'+$scope.id).width());

              $scope.chart.mainGroup.attr("transform", function() 
                    { return "translate(" + pad + ",0)"; });

              var nodes = $scope.chart.mainGroup
                  .datum($scope.data)
                  .selectAll(".node")
                  .data(pack.nodes);

              nodes.enter()
                  .append("g")
                  .attr("class", function(d) 
                    { 
                      var what =  d.children ? "node" : "leaf node";
                      return what;
                  })
                  .each(function(){
                    d3.select(this).append("circle")
                      .filter(function(d) { return d.name !== "total"; })
                      .style("fill", function() 
                        { 
                          return $scope.config.color;
                        });
                  
                    d3.select(this).append("text")
                      .attr("dy", "0em")
                      .classed('bubble-chart-text-title',true)
                      .style("stroke", function() 
                        { 
                          return $scope.config.color;
                        })
                      /*.style("fill", function() 
                        { 
                          return d3.rgb($scope.config.color).darker(2);
                        })*/
                      .text(function(d) { return d.name; });

                    d3.select(this).append("text")
                      .attr("dy", "1em")
                      .classed('bubble-chart-text-subtitle',true)
                      /*.style("fill", function() 
                        { 
                          return d3.rgb($scope.config.color).darker(1);
                        })*/
                      .text(function(d) { return d.data; });
                  });
                  
              nodes.attr("transform", function(d) 
                    { return "translate(" + d.x + "," + d.y + ")"; });

              nodes.selectAll('circle')
                  .attr("r", function(d) { return d.r; });

          }

          setTimeout(function(){
            render();
          },1000);

          var id;
          $(window).resize(function() {
            clearTimeout(id);
            id = setTimeout(function(){
              if($scope.chart){
                render();
              }
            }, 500);
    });


        }, 
        template: '<div id="{{id}}"></div>'
    };

});