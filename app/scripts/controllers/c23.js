'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso23Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 23; });
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
            meta: 'area',
            cesacs: 'line',
          },
          keys: {
              value: ['cesacs','meta'],
              x:'fecha'
          },
          names: {
            meta: 'Meta',
            cesacs: 'Cesacs'
          },
          colors: {
            'Meta':$scope.currentCompromise.color,
            'Cesacs':$scope.currentCompromise.secondColor}
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
                  count:4
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
                }
              }
          }
        },
        legend: {
            show: true
        }
      });
    };


    $scope.chartReady = function(chart){

    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%Y-%m',
          type: 'bar',
          keys: {
              value: ['cantidad','acumulado'],
              x: 'fecha'
          },
          groups: [
            ['cantidad','acumulado']
          ],
          names: {
            cantidad: 'Cantidad',
            acumulado: 'Acumulado '
          },
          colors: {'acumulado':$scope.currentCompromise.secondColor,
                    'cantidad': $scope.currentCompromise.color}
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
          // if(chart1){
          //   createCustomChart1();
          // }
        }, 500);
    });


  });
