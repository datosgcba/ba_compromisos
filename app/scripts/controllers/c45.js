'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso45Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    var chart3;

    //para ir a otra url en el padre
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 45; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,$scope.currentCompromise.porcentaje_completado,function(iconLoaded){

        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

     $scope.prepareData1 = function(data){
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%d-%m-%Y',
          keys: {
              value: ['avance'],
              x: 'obra'
          },
          names:{
            'avance': 'Avance'
          },
          colors: {
              'avance': $scope.currentCompromise.color,
            }
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 40,
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
                  format: '%m-%Y'
            },
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
                },
              }
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady1 = function(chart){

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
