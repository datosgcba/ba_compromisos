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
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
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

    //detalle 1
    $scope.dataLoaded = function(id,data){
      console.log(id,data);
    };

    //detalle 2

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

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        valueField: 'hectareas',
        color: $scope.currentCompromise.color
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
              value: ['metros_habitante'],
              x:'ciudad'
          },
          colors: {'metros_habitante':$scope.currentCompromise.color}
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

    $scope.chartReady3 = function(chart){

    };

  	
  });
