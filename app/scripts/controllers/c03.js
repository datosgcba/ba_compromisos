'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso03Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

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
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
      console.log($scope.currentCompromise);
    });

    $scope.youtubeLink = 'https://www.youtube.com/watch?v=AoZ98-TwqM4';


    $scope.prepareData = function(data){
      return data;
    };

    $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
          types: {
            meta_acumulado: 'area',
            adultos_incluidos_acumulado: 'line'
          },
          keys: {
              value: ['adultos_incluidos_acumulado','meta_acumulado'],
              x: 'mes'
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
            left: 20,
        },
        axis: {
          x: {
              type: 'category',
              show:false
          },
          y: {
              show:false
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
            left: 20,
        },
        axis: {
          x: {
              type: 'category',
              show:false
          },
          y: {
              show:false
          }
        },
        legend: {
            // show: false
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
            left: 100,
        },
        axis: {
          rotated:true,
          x: {
              type: 'category',
              show:true
          },
          y: {
              show:false
          }
        },
        legend: {
            show: false
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
