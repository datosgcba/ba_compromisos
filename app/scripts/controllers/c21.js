'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso21Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 21; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        $(iconLoaded)
            .attr('width', '100%')
            .attr('height', '100%')
            .get(0);
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
            nuevas_rampas_construidas: 'line',
          },
          keys: {
              value: ['nuevas_rampas_construidas','meta'],
              x:'fecha'
          },
          names: {
            meta: 'Meta',
            nuevas_rampas_construidas: 'Nuevas rampas construídas'
          },
          colors: {
            'nuevas_rampas_construidas':$scope.currentCompromise.color,
            'meta':$scope.currentCompromise.secondColor}
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
              value: ['nuevas_rampas','diff'],
              x: 'fecha'
          },
          groups: [
            ['nuevas_rampas','diff']
          ],
          names: {
            nuevas_rampas: 'Nuevas Rampas',
            diff: 'Meta'
          },
          colors: {
            'nuevas_rampas': $scope.currentCompromise.color,
            'diff':$scope.currentCompromise.secondColor
          }
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
           rotated: true,
           x: {
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b-%y"),
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
      return data.map(function(e){
        e.diff = parseInt(e.meta) - parseInt((e.nuevas_rampas)?e.nuevas_rampas:0);
        return e;
      });
    };



    $scope.chartReady2 = function(chart){

    };

 $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['varon','mujer'],
              x: 'comunas'
          },
          groups: [
            ['varon','mujer']
          ],
          names: {
            varon: 'Varón',
            mujer: 'Mujer',
            comunas: 'Comunas'
          },
          colors: {
            'varon':$scope.currentCompromise.secondColor,
            'mujer': $scope.currentCompromise.color}
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
    $scope.prepareData3 = function(data){
      return data;
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
