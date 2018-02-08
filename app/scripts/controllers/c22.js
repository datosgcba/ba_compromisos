'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso22Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 22; });
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
            acumulado: 'line',
          },
          keys: {
              value: ['meta','acumulado'],
              x:'trimestre'
          },
          names: {
            meta: 'Meta',
            acumulado: 'Acumulado'
          },
          colors: {
            'meta':$scope.currentCompromise.secondColor,
            'acumulado':$scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 10,
            bottom: 10,
            left: 30,
        },
        axis: {
           x: {
              type: 'categories',
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


    $scope.chartReady = function(chart){

    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
           xFormat: '%Y-%m',
           types: {
            meta: 'area',
            acumulado: 'line',
          },
          keys: {
              value: ['meta','acumulado'],
              x:'trimestre'
          },
          names: {
            meta: 'Meta',
            acumulado: 'Acumulado'
          },
          colors: {
            'meta':$scope.currentCompromise.secondColor,
            'acumulado':$scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 10,
            bottom: 10,
            left: 30,
        },
        axis: {
           x: {
              type: 'categories',
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
