'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso01Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;
    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 1; });
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);

      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
      console.log($scope.currentCompromise);
    });

    var colorMeta = '#ccc';

    //1
    $scope.prepareData1 = function(data){
      console.log(1,data);
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          types: {
            baches_resueltos: 'line',
            meta: 'area'
          },
          keys: {
              value: ['baches_resueltos','meta'],
              x:'mes'
          },
          colors: {'meta':colorMeta,
                    'baches_resueltos': $scope.currentCompromise.color}
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


    //2
    $scope.prepareData2 = function(data){
      console.log(2,data);
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          types: {
            dias: 'line',
            meta: 'area'
          },
          keys: {
              value: ['dias','meta'],
              x:'mes'
          },
          colors: {'meta': colorMeta,
                    'dias': $scope.currentCompromise.color}
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


    //3
    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          keys: {
              value: ['baches'],
              x:'ano'
          }
        },
        axis: {
          x: {
              label: 'Año'
          },
          y: {
              label: 'Baches arreglados'
          }
        }
      });
    };

    $scope.prepareData3 = function(data){
      return data;
    };

  	
  });
