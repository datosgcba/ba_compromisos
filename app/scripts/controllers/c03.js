'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso03Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 3; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
      //console.log($scope.currentCompromise);;
    });


    $scope.prepareData = function(data){
      return data;
    };

    $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%Y-%m',
          types: {
            meta_acumulado: 'area',
            adultos_incluidos_acumulado: 'line'
          },
          keys: {
              value: ['meta_acumulado','adultos_incluidos_acumulado'],
              x: 'mes'
          },
          names: {
            meta_acumulado: 'Meta',
            adultos_incluidos_acumulado: 'Adultos mayores incluidos '
          },
          colors: {'meta_acumulado':$scope.currentCompromise.secondColor,
                    'adultos_incluidos_acumulado': $scope.currentCompromise.color}
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
                  count:6
              }
          },
          y: {
              show:true,
              max:94000
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){

    };
    $scope.prepareData2 = function(data){
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['uso_computadora','uso_internet'],
              x:'edad'
          },
          names: {
            uso_computadora: 'Uso Computadora',
            uso_internet: 'Uso Internet'
          },
          colors: {
            'uso_computadora':$scope.currentCompromise.color,
            'uso_internet':$scope.currentCompromise.secondColor}
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
              show:true
          },
          y: {
              show:true,
              min: 0,
              max:100,
              tick:{
                format:function(y){
                  return y+'%';
                }
              },
              padding: {top:0, bottom:0}
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady2 = function(chart){

    };

    //detalle 3

    $scope.prepareData3 = function(data){
      return data;
    };

    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['poblacion_mayor_o_igual_65'],
              x:'provincia'
          },
          names: {
            poblacion_mayor_o_igual_65: 'Población mayor o igual a 65 años',
            provincia: 'Provincia'
          },
          colors:
          {'poblacion_mayor_o_igual_65':
          $scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 120,
        },
        axis: {
          rotated:true,
          x: {
              type: 'category',
              show:true
          },
          y: {
              show:true,
              min: 0,
              max:100,
              padding: 5,
              tick:{
                format:function(y){
                  return y+'%';
                }
              }
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady3 = function(chart){

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
