'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso13Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 13; });
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


    $scope.prepareData1 = function(data){
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          types: {
            'Meta G2': 'line', 
            'Desempeño G2'  : 'line', 
            'Meta G3' : 'line', 
            'Desempeño G3': 'line'
          },
          regions: {
            'Meta G2': [{'style':'dashed'}], 
            'Meta G3': [{'style':'dashed'}], 
          },
          keys: {
              value: ['Meta G2','Desempeño G2', 'Meta G3', 'Desempeño G3'],
              x: 'anio'
          },
          colors: {
                'Meta G2': '#3cb8b0', 
                'Desempeño G2'  : '#3cb8b0', 
                'Meta G3' : '#f98f41', 
                'Desempeño G3': '#f98f41', 
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
              type: 'category',
              show:true
          },
          y: {
            show:true,
            tick:{
              format: function(value) {return Math.round(value*100) + '%';}
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
