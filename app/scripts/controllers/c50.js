'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso50Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 50; });
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
            avance : 'line'
          },
          keys: {
              value: [ 'avance'],
              x: 'trimestre'
          },
          names: {
            avance: 'Avance'
          },
          colors: {
                'avance': $scope.currentCompromise.color
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
              show:true,

          },
          y: {
            show:true,
            max:99
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){

    };


    var data2 = {};
    $scope.prepareData2 = function(data){
      data2 = data;

      for (var i = 0; i < data2.length; i++) {
        data2[i].avance = (data2[i].avance)?parseInt(data2[i].avance):0;
        data2[i].restante = parseInt(100 - data2[i].avance);
      };
      return data2;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          xFormat: '%Y-%m',
          keys: {
              value: ['avance','restante'],
              x:'polo_educativo'
          },
          groups: [
            ['restante','avance']
          ],
          names: {
            avance: 'Avance',
            restante: 'Restante'
          },
          order: null,
          colors:
            {
              'avance': $scope.currentCompromise.color,
              'restante': $scope.currentCompromise.grayColor
            }
        },
        size: {
            height: 340,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 20,
        },
        axis: {
          rotated:true,
          x: {
              type: 'category',
              show:false
          },
          y: {
              show:true,
              min: 0,
              padding: 5,
              tick:{
                format:function(y){
                  return y+'%';
                }
              }
          }
        },
        legend: {
            show: false
        }
      });
    };

    $scope.chartReady2 = function(chart,id){
      var container = d3.select('#'+id+' .c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data2[d.index];
        var bar = d3.select(this);
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.polo_educativo);
      });
    };

    var data3 = {};
    $scope.prepareData3 = function(data){
      data3 = data;

      for (var i = 0; i < data3.length; i++) {
        data3[i].avance = (data3[i].avance)?parseInt(data3[i].avance):0;
        data3[i].restante = parseInt(100 - data3[i].avance);
      };
      return data3;
    };

    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          xFormat: '%Y-%m',
          keys: {
              value: ['avance','restante'],
              x:'iniciativas'
          },
          groups: [
            ['restante','avance']
          ],
          names: {
            avance: 'Avance',
            restante: 'Restante'
          },
          order: null,
          colors:
            {
              'avance': $scope.currentCompromise.color,
              'restante': $scope.currentCompromise.grayColor
            }
        },
        size: {
            height: 340,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 20,
        },
        axis: {
          rotated:true,
          x: {
              type: 'category',
              show:false
          },
          y: {
              show:true,
              min: 0,
              padding: 5,
              tick:{
                format:function(y){
                  return y+'%';
                }
              }
          }
        },
        legend: {
            show: false
        }
      });
    };

    $scope.chartReady3 = function(chart,id){
      var container = d3.select('#'+id+' .c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data3[d.index];
        var bar = d3.select(this);
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.iniciativas);
      });
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
