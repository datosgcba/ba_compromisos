'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso28Ctrl', function ($rootScope,UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    var treeIcon,data3;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 28; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.secondColor = '#ccc';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,$scope.currentCompromise.porcentaje_completado,function(iconLoaded){

        treeIcon = iconLoaded;
        $(iconLoaded)
            .attr('width', '100%')
            .attr('height', '100%')
            .get(0);
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart1,chart1Id,chart1Data;
    var chart2,chart2Config,chart2Id,chart2Data;

    $scope.prepareData = function(data){
      return data;
    };
 $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
           xFormat: '%Y-%m',
          types: {
            avance: 'line',
          },
          keys: {
              value: ['avance'],
              x:'fecha'
          },
          names: {
            avance: 'Avance'
          },
          colors: {
            'avance':$scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 80,
        },
        axis: {
           x: {
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b-%y"),
                  count:5
              }
          },
          y: {
              show:true,
              min: 0,
              max:100,
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
    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['tiempo_promedio'],
              x: 'pais'
          },
          names: {
            tiempo_promedio: 'Tiempo Promedio'
          },
          colors: {'tiempo_promedio':$scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 20,
        },
        axis: {
           x: {
              type: 'category',
              show:true,
          },
          y: {
              show:false,
              min: 0,
              padding: {top:0, bottom:0}
          }
        },
        legend: {
            show: true
        }
      });
    };
    $scope.prepareData2 = function(data){
      return data;
    };



    $scope.chartReady2 = function(chart){

    };
    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          if(chart1){
            createCustomChart1();
          }
        }, 500);
    });

  });
