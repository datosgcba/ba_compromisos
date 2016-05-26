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

  	var url = UrlService.getUrlByPage('home');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 1; });
      $scope.loading = false;
    });

    $scope.completeConfig = function(config){
      console.log('pasa complete config');
      return angular.merge(config,{
        data:{
          keys: {
              value: ['baches'],
              x:'ano'
          }
        },
        axis: {
          x: {
              label: 'Año'
          },
          y: {
              label: 'Baches arreglados'
          }
        }
      });
    }

    $scope.prepareData = function(data){
      return data;
    }

  	
  });
