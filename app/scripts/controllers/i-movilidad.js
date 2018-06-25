'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('IlustracionMovilidadCtrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {

  	var homeUrl = UrlService.getUrlByPage('home');
    var ilustracionUrl = UrlService.getUrlByPage('ilustraciones');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;
    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(homeUrl)
    .success(function(data){
      $scope.currentCompromise = $scope.data;

      
      $http.jsonp(ilustracionUrl).success(function(dataIlustracion){
        $scope.currentIlustracion = dataIlustracion;
        $scope.loading = false;
      });
    });
  });
