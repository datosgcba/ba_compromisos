'use strict';

angular.module('compromisosSiteApp')
.directive('smartContent', function() {
    return {
        restrict: 'E',
        replace: true,
        scope: {
          url: '=url',
          dataCallback: '=dataCallback',
          configCallback: '=configCallback',
          template: '=template'
        },
        controller: function($scope, $timeout, UrlService, $http) {

            $scope.loading = true;

            $scope.id = 'content-' + Math.floor((Math.random()*10000));

            //is Yotube?
            function isYoutube(url) {
                return(url.match(/\b\w*(youtu)\w*\b/) != null);
            };
            //is image?
            function isImage(url) {
                return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
            };
            //function used on the ng-include to resolve the template
            $scope.getTemplateUrl = function() {
                if($scope.template){
                    return $scope.template;
                }
                if(isYoutube($scope.url)){
                    $scope.loading = false;
                    return "views/directives/youtubePlayer.html";
                }else if(isImage($scope.url)){
                    $scope.loading = false;
                    return "views/directives/imageFull.html";
                }else{
                    return "views/directives/simpleChart.html";
                }
            };

            $scope.chartConfigDefaults = {
                data:{                
                    json: []
                }
            };

            $scope.renderChart = function(){

                var url = UrlService.getUrlByCsv($scope.url);

                console.log('renderChart');
                $scope.chartConfigDefaults.bindto = '#'+$scope.id;
                
                $http.jsonp(url)
                .success(function(data){
                    if($scope.dataCallback){
                        $scope.chartConfigDefaults.data.json = $scope.dataCallback(data);
                    } else {
                        $scope.chartConfigDefaults.data.json = data;
                    }

                    if($scope.configCallback){
                        $scope.chartConfigDefaults = $scope.configCallback($scope.chartConfigDefaults);
                    }

                    $timeout(function() {
                        console.log(JSON.stringify($scope.chartConfigDefaults));
                        c3.generate($scope.chartConfigDefaults);
                        $scope.loading = false;
                    },500)
                });

            }
        }, 
        template: '<ng-include src="getTemplateUrl()"/>'
    };

});