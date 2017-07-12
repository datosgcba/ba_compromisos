'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso41Ctrl', function (UrlService, $scope,$rootScope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 41; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
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
              value: ['avance'],
              x: 'mes'
          },
          names:{
            'avance':'Avance'
          },
          colors: {
            'avance': $scope.currentCompromise.color
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
                  format: $rootScope.d3Locale_ES.timeFormat("%b-%y"),
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


    //detalle 2
    var data2 = {};
    $scope.prepareData2 = function(data){
      data2 = data;
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['contravenciones','delitos'],
              x:'comuna'
          },
          names: {
            contravenciones: 'Contravenciones',
            delitos: 'Delitos'
          },
          colors:
          {'contravenciones':$scope.currentCompromise.color,
          'delitos': $scope.currentCompromise.secondColor}
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
          rotated:true,
          x: {
              type: 'category',
              show:true
          },
          y: {
              show:true
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady2 = function(chart,id){

    };

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          // if(chart1){
          //   createCustomChart1();
          // }
        }, 500);
    });


  });
