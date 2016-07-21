'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso11Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 11; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

     $scope.prepareData1 = function(data){
      data.map(function(d){
        d.mes += '-01';
        d.porcentaje_avance = (d.porcentaje_avance)?parseInt(d.porcentaje_avance):0;
      });
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          keys: {
              value: ['meta'],
              x: 'mes'
          },
          names:{
            'meta':'Meta'
          },
          colors: {
            'meta': $scope.currentCompromise.color
            }
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 40,
            bottom: 10,
            left: 40,
        },
        axis: {
          x: {
              type:'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: "%b-%Y",
                  count:4
              }
          },
          y: {
              show:true,
              min: 0,
              padding: 5,
              tick:{
                format:function(y){
                  return y+'%';
                },
              }
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady1 = function(){

    };


  });
