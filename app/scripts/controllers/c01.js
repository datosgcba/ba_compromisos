'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso01Ctrl', function (UrlService, $scope, $http) {

  	var url = UrlService.getUrl('home') + '&callback=JSON_CALLBACK';

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
    	console.log(data);
      $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 1; });
      $scope.loading = false;
      $scope.init();
    });

    $scope.init = function(){
    	console.log('init');
    };
  	
  });
