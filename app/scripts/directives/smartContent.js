'use strict';

angular.module('compromisosSiteApp')
.directive('smartContent', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          url: '=url',
          title: '=titulo',
          nota: '=nota',
          fuente: '=fuente',
          prepareCallback: '=prepareCallback',
          configCallback: '=configCallback',
          readyCallback: '=readyCallback',
          simpleLoadCallback: '=simpleLoadCallback',
          template: '=template'
        },
        controller: function($scope, $timeout, UrlService, $http) {

            $scope.loading = true;

            $scope.id = 'content-' + Math.floor((Math.random()*10000));

            //is Yotube?
            function isYoutube(url) {
                return(url.match(/\b\w*(youtu)\w*\b/) !== null);
            }
            //is image?
            function isImage(url) {
                return(url.match(/\.(jpeg|jpg|gif|png)$/) !== null);
            }
            //function used on the ng-include to resolve the template
            $scope.getTemplateUrl = function() {
                if(isYoutube($scope.url)){
                    $scope.loading = false;
                    return "views/directives/youtubePlayer.html";
                }else if(isImage($scope.url)){
                    $scope.loading = false;
                    return "views/directives/imageFull.html";
                }else{
                    if($scope.template){
                        return $scope.template;
                    }
                    return "views/directives/simpleChart.html";
                }
            };

            $scope.chartConfigDefaults = {
                data:{                
                    json: []
                },
                padding: {
                  top: 0,
                  right: 50,
                  bottom: 0,
                  left: 50,
                },
                onrendered: function () {
                  /*if($scope.readyCallback){
                    $scope.readyCallback($scope.chart,$scope.id);
                  }*/
                }
            };

            $scope.bubbleConfigDefaults = {
                valueField:'value',
                color:'red'
            };

            $scope.renderBubble = function(){

                var url = UrlService.getUrlByCsv($scope.url);

                $scope.chartConfigDefaults.bindto = '#'+$scope.id;
                
                $http.jsonp(url)
                .success(function(data){
                    if($scope.prepareCallback){
                        $scope.data = $scope.prepareCallback(data);
                    } else {
                        $scope.data = data;
                    }

                    if($scope.configCallback){
                        $scope.config = $scope.configCallback($scope.bubbleConfigDefaults);
                    }

                    $timeout(function() {
                        $scope.chart=false;
                        createBubbleChart();
                        $scope.bindFinalEvents();
                    },500);
                });

            };

            function createBubbleChart(){
                $scope.resizeFunction = createBubbleChart;
                var diameter = 300;
                var pad = ($('#'+$scope.id).width()-diameter) / 2;

                if($('#'+$scope.id).width()<diameter){
                  diameter = $('#'+$scope.id).width();
                  pad = 0;
                }

                var pack = d3.layout.pack()
                  .sort(null)
                  .size([diameter, diameter])
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
                        .attr("dy", ".3em")
                        .style({
                             "text-anchor": "middle",
                             "fill":"white", 
                             "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
                             "font-size": "12px"})
                        .text(function(d) { return d.name; });
                    });
                    
                nodes.attr("transform", function(d) 
                      { return "translate(" + d.x + "," + d.y + ")"; });

                nodes.selectAll('circle')
                    .attr("r", function(d) { return d.r; });

                if($scope.readyCallback){
                  $scope.readyCallback($scope.chart,$scope.id);
                }

            }

            $scope.renderChart = function(){

                var url = UrlService.getUrlByCsv($scope.url);

                $scope.chartConfigDefaults.bindto = '#'+$scope.id;
                
                $http.jsonp(url)
                .success(function(data){
                    if($scope.prepareCallback){
                        $scope.chartConfigDefaults.data.json = $scope.prepareCallback(data);
                    } else {
                        $scope.chartConfigDefaults.data.json = data;
                    }
                    if($scope.configCallback){
                        $scope.chartConfigDefaults = $scope.configCallback($scope.chartConfigDefaults);
                    }

                    $timeout(function() {
                        $scope.chart = c3.generate($scope.chartConfigDefaults);
                        $scope.bindFinalEvents();
                        if($scope.readyCallback){
                          $scope.readyCallback($scope.chart,$scope.id);
                        }
                    },500);
                });

            };

            $scope.simpleLoad = function(){
              var url = UrlService.getUrlByCsv($scope.url);
              $http.jsonp(url)
              .success(function(data){
                if($scope.simpleLoadCallback){
                  $scope.simpleLoadCallback($scope.id,data);
                  $scope.bindFinalEvents();
                }
              });
            };

            $scope.bindFinalEvents = function(){
                $scope.loading = false;
                $('[data-toggle="popover"]').popover();
            };

            var id;
            $(window).resize(function() {
                clearTimeout(id);
                id = setTimeout(function(){ 
                  if($scope.resizeFunction){
                    $scope.resizeFunction();
                  }
                }, 500);
            });

        }, 
        template: '<ng-include src="getTemplateUrl()"/>'
    };

});