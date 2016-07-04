'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso06Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 6; });
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


    $scope.prepareData = function(data){
      return data;
    };

    $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
          types: {
            kilometros_construidos_proyectados: 'line',
            kilometros_construidos_totales : 'line'
          },
          regions: {
            'kilometros_construidos_proyectados': [{'style':'dashed'}], 
          },
          names: {
            kilometros_construidos_proyectados: 'Km Proyectados',
            kilometros_construidos_totales : 'Km Construidos'
          },
          keys: {
              value: ['kilometros_construidos_proyectados','kilometros_construidos_totales'],
              x: 'anio'
          },
          colors: {
                'kilometros_construidos_proyectados':$scope.currentCompromise.color,
                'kilometros_construidos_totales': $scope.currentCompromise.color}
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
            show:true
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){

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
              value: ['pasajeros_diarios'],
              x:'corredor'
          },
          colors: 
          {'pasajeros_diarios': $scope.currentCompromise.color}
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
        }
      });
    };
 
    $scope.chartReady2 = function(chart,id){
      var container = d3.select('#'+id+'.c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data2[d.index];
        var bar = d3.select(this);
        //TODO: Agrego clase? con .tipo>?
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.corredor);
      });
    };

     //detalle 2
    var data3 = {};
    $scope.prepareData3 = function(data){
      data3 = data;

      for (var i = 0; i < data3.length; i++) {
        var p = parseFloat(data3[i].porcentaje_avance);
        data3[i].restante = 100 - p;
      };
      return data;
    };

    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['porcentaje_avance', 'restante'],
              x:'corredor'
          },
          groups: [
            ['porcentaje_avance','restante']
          ],
          colors: 
          {'porcentaje_avance': $scope.currentCompromise.color,
          'restante': $scope.currentCompromise.secondColor}
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
        }
      });
    };
 
    $scope.chartReady3 = function(chart,id){
      var container = d3.select('#'+id+'.c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data3[d.index];
        var bar = d3.select(this);
        //TODO: Agrego clase? con .tipo>?
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.corredor);
      });
    };


     //detalle 2
    var data4 = {};
    $scope.prepareData4 = function(data){
      data4 = data;
      return data;
    };

    $scope.completeConfig4 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['proyectados','kilometros',],
              x:'ciudad'
          },
          groups: [
            ['proyectados','kilometros']
          ],
          colors: 
          {'kilometros': $scope.currentCompromise.color,
          'proyectados' : $scope.currentCompromise.secondColor}
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
        }
      });
    };
 
    $scope.chartReady4 = function(chart,id){
      var container = d3.select('#'+id+'.c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data4[d.index];
        var bar = d3.select(this);
        //TODO: Agrego clase? con .tipo>?
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