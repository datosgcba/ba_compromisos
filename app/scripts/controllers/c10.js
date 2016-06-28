'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso10Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 10; });
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
        $('#icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

     $scope.prepareData1 = function(data){
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          keys: {
              value: ['estudiantes_abandonan','variacion_interanual','variacion_acumulada'],
              x: 'anio'
          },
          names:{
            'estudiantes_abandonan': 'Abandonos',
            'variacion_interanual': 'Interanual',
            'variacion_acumulada': 'Acumulada',

          },
          colors: {
            'estudiantes_abandonan': $scope.currentCompromise.color,
          'variacion_interanual': $scope.currentCompromise.secondColor,
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

    $scope.chartReady1 = function(chart){

    };
  

    //detalle 2
    $scope.prepareData2 = function(data){
      // _.each(data,function(d){
      //   d.mes_date = d.mes+'-01';
      //   d.linea_a = parseInt(d.linea_a);
      //   d.linea_b = parseInt(d.linea_b);
      //   d.linea_c = parseInt(d.linea_c);
      //   d.linea_d = parseInt(d.linea_d);
      //   d.linea_e = parseInt(d.linea_e);
      //   d.linea_h = parseInt(d.linea_h);
      //   d.anio = parseInt(d.anio);
      // });
      // $scope.data3 = data;
      // $scope.selectedYear = 2015;
      // $scope.selectOptions = _.map(_.groupBy(data, 'anio'),function(v,k){return parseInt(k); });
      // return $scope.getFilteredData();
      return data;
    };

    // $scope.changeOption = function(){
    //   chart2.load(
    //     angular.merge($scope.dataConfig,{
    //       json: $scope.getFilteredData()
    //     })
    //   );
    // };

    // $scope.getFilteredData = function(){
    //   return _.filter($scope.data2, {'anio':$scope.selectedYear});
    // };

    $scope.completeConfig2 = function(config){
      $scope.dataConfig = {
        keys: {
              value: 
              [
              '1996_1997',
              '1997_1998',
              '1998_1999', 
              '1999_2000',
              '2000_2001', 
              '2001_2002', 
              '2002_2003', 
              '2003_2004', 
              '2004_2005', 
              '2005_2006',
              '2006_2007',
              '2007_2008', 
              '2008_2009', 
              '2009_2010', 
              '2010_2011', 
              '2011_2012',
              '2012_2013',
              '2013_2014'],
              x: 'provincia'
          },
          type: 'spline'

        };
      return angular.merge(config,{ 
        data:$scope.dataConfig,
        size: {
            height: 300,
        },
        point: {
            show: false
        },
        padding: {
            top: 0,
            right: 40,
            bottom: 10,
            left: 60,
        },
        axis: {
          x: {
              type: 'timeseries',
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
      // chart3 = chart;
      // $( "<div id='selector-container'></div>" ).insertBefore( "#"+id );
      // var templateUrl = $sce.getTrustedResourceUrl('views/includes/selector.html');
      // $templateRequest(templateUrl).then(function(template) {
      //     $compile($('#selector-container').html(template).contents())($scope);
      // }, function() {
      //     // An error has occurred
      // });
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
