'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso40Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;
    var chart3;


    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 40; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
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
            avance : 'line'
          },
          keys: {
              value: ['meta', 'avance'],
              x: 'trimestre'
          },
          names: {
            avance: 'Avance',
            meta: 'Meta'
          },
          colors: {
                //'meta':$scope.currentCompromise.secondColor,
                'meta':'#ccc',
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
            max:110
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){
    };

    //detalle 4
    var data4;
    $scope.prepareData4 = function(data){
      data4 = data;
      return data;
    };

    $scope.completeConfig4 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['metros_habitante'],
              x:'ciudad'
          },
          names: {
            metros_habitante: ' m² por Habitante'
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
              show:true
          }
        },
        legend: {
            show: false
        },
        bar: {
            width: {
                ratio: 0.8 // this makes bar width 50% of length between ticks
            }
        },

      });
    };

    $scope.chartReady4 = function(chart,id){
      var container = d3.select('.c3-texts-metros-habitante');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data4[d.index];
        var bar = d3.select(this);
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.ciudad);
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
