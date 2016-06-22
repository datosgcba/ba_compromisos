'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso05Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 5; });
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('#icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    $scope.youtubeLink = 'https://www.youtube.com/watch?v=AoZ98-TwqM4';

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          type: 'pie',
          keys: {
              value: ['hectareas']
          }
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
              show:false
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

    $scope.prepareData1 = function(data){
      console.log('data1',data);
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        valueField: 'hectareas'
      });
    };

    $scope.prepareData2 = function(data){

      var transformed = { 
                        name:"total",
                        children:[]
                      };

      _.each(data,function(d){
        transformed.children.push({
          name: d.tipo,
          value: parseInt(d.hectareas),
          children : []
        });
      });

      return transformed;
    };

    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['metros_habitante'],
              x:'ciudad'
          },
          colors:['#ff9900']
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
              show:false
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

    $scope.prepareData3 = function(data){
      return data;
    };

  	
  });
