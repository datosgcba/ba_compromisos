'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('IlustracionesCtrl', function (UrlService,$rootScope, $routeParams, $scope, $http,GetSVGNameService, SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {
    $scope.vizName = $routeParams.name;
  	var homeUrl = UrlService.getUrlByPage('home');
    var ilustracionUrl = UrlService.getUrlByPage('ilustraciones');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;
    

    $scope.loading = true;
    $scope.closeDetail = function(){
      $scope.currentIlustracion = undefined;
    };

    $scope.showMe = function(ilu){
      $scope.closeMobileDetail();
      ilu.showDetail = true;
    };

    $scope.closeMobileDetail = function(){
      $scope.ilustraciones.map(function(i){
        i.showDetail= false;
      })
    };
    $scope.showCompromiso = function(cId){
      var currentIlu = _.find($scope.ilustraciones, function(d){ return parseInt(d.indicador) === parseInt(cId); });
      $scope.currentIlustracion = currentIlu;
    };

    $http.jsonp(homeUrl)
    .success(function(dataCompromisos){
      
      dataCompromisos.map(function(c) {
          c.slug = c.slug.trim();
          c.categoria = c.categoria.trim();
          c.iconSVG = GetSVGNameService.getUrl(c.numero);
          if (c.porcentaje_completado == "100"){
            c.iconSVG = GetSVGNameService.getUrl(c.numero, "z");
          }
          
      });
      $scope.compromisos = dataCompromisos;

      $http.jsonp(ilustracionUrl).success(function(dataIlustracion){
        dataIlustracion =  dataIlustracion.filter(function(d){ return d.viz === $scope.vizName; });
        dataIlustracion.map(function(ilu){
          ilu.detalleCompromiso = _.find($scope.compromisos, function(d){ return parseInt(d.numero) === parseInt(ilu.compromiso); });  
        })
        
        $scope.ilustraciones = dataIlustracion;
        $scope.loading = false;
      });
    });
  });
