'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso38Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 38; });
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
    });

    $scope.prepareData = function(data){
      return data;
    };

  $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
          types: {
            meta: 'area',
            avance: 'line',
          },
          keys: {
              value: ['meta','avance'],
              x:'trimestre'
          },
          names: {
            avance: 'Avance',
            meta: 'Meta',
          },
          colors: {'meta':$scope.currentCompromise.secondColor,
                    'avance': $scope.currentCompromise.color}
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
              type: 'category',
              show:true,

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
