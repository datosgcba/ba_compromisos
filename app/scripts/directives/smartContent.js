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

            function getVideoId(url) {
              if(url.match(/\b\w*(youtube)\w*\b/) !== null){
                return $.urlParam(url,'v');
              }
              if(url.match(/\b\w*(youtu\.be)\w*\b/) !== null){
                return url.split('/')[3];
              }
            }

            //function used on the ng-include to resolve the template
            $scope.getTemplateUrl = function() {
                if(isYoutube($scope.url)){
                    $scope.loading = false;
                    $scope.ytSwitch = false;
                    var ytId = getVideoId($scope.url);
                    $scope.ytThumbnail = "http://img.youtube.com/vi/{{VIDEO_ID}}/maxresdefault.jpg".replace("{{VIDEO_ID}}",ytId);
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
                legend:{
                    
                  // amount of padding to put between each legend element
                  padding: 35,
                  // define custom height and width for the legend item tile
                  item: {
                      tile: {
                          width: 20,
                          height: 20
                      },
                      //disables any click :)
                      onclick: function () {}
                  },
                },
                onrendered: function () {
                  
                }
            };

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
                        $timeout(function(){
                          if($scope.readyCallback){
                            $scope.readyCallback($scope.chart,$scope.id);
                          }  
                        },1200)
                        
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