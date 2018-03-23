'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso53Ctrl', function (UrlService,$rootScope, $compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    var treeIcon,data3;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 53; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.secondColor = '#ccc';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
      console.log($scope.currentCompromise);
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

    //detalle 1
    $scope.dataLoaded = function(id,data){
      console.log("manu");
      console.log(data);
    };


    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
           //xFormat: '%Y-%m',
           types: {
            nuevos: 'bar',
            acumulado: 'bar',
          },
          keys: {
              value: ['acumulado','nuevos'],
              x:'fecha'
          },
          names: {
            nuevos: 'Nuevos metros peatonalizados',
            acumulado: 'Acumulado'
          },
          colors: {
            'acumulado':$scope.currentCompromise.secondColor,
            'nuevos':$scope.currentCompromise.color}
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
              type: 'category',
              show:true,
              tick: {
                rotate: 90,
                multiline: false
                  //format: function (d) { return "$" + d; }
                  //format: $rootScope.d3Locale_ES.timeFormat("%b-%y")
              }
          },
          y: {
              show:true,
              min: 0,
              padding: 5,

          }
        },
        legend: {
            show: true
        }
      });
    };
    $scope.prepareData1 = function(data){
      console.log(data);
      return data;
    };



    $scope.chartReady1 = function(chart){

    };


  });
