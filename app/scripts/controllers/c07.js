'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso07Ctrl', function (UrlService, $rootScope, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 7; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.porcentaje_completado_2 = parseInt($scope.currentCompromise.cumplimiento_2_porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.loading = false;
      //console.log($scope.currentCompromise);;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){

        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    $scope.prepareData1 = function(data){
      function toSeconds(ms){
        if(ms){
          ms = ms.split(':');
          return(+ms[0]) * 60 + (+ms[1]);
        } else {
          return null;
        }
      }
      _.each(data,function(d){
        d.mes_date = d.mes+'-01';
        d.linea_a_sec = toSeconds(d.linea_a);
        d.linea_b_sec = toSeconds(d.linea_b);
        d.linea_c_sec = toSeconds(d.linea_c);
        d.linea_d_sec = toSeconds(d.linea_d);
        d.linea_e_sec = toSeconds(d.linea_e);
        d.linea_h_sec = toSeconds(d.linea_h);
         d.total_sec = toSeconds(d.total);
      });
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          keys: {
              value: ['linea_a_sec','linea_b_sec','linea_c_sec','linea_d_sec','linea_e_sec','linea_h_sec','total_sec'],
              x: 'mes_date'
          },
          names:{
            'linea_a_sec':'Línea A',
            'linea_b_sec':'Línea B',
            'linea_c_sec':'Línea C',
            'linea_d_sec':'Línea D',
            'linea_e_sec':'Línea E',
            'linea_h_sec':'Línea H',
            'total_sec':'Total'
          },
          type: 'spline',
          colors: {
            'linea_a_sec': "rgb(0, 174, 219)",
            'linea_b_sec': "rgb(238, 27, 46)",
            'linea_c_sec': "rgb(1, 103, 178)",
            'linea_d_sec': "rgb(0, 128, 103)",
            'linea_e_sec': "rgb(108, 33, 128)",
            'linea_h_sec': "rgb(255, 210, 3)"
          }
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 40,
            bottom: 10,
            left: 40,
        },
        point: {
            show: false
        },
        axis: {
          x: {
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b-%y"),
                  count:6
              }
          },
          y: {
              show:true,
              tick: {
                format: function (time) {
                  var minutes = Math.floor(time / 60);
                  var seconds = time - minutes * 60;
                  seconds = ((''+seconds).length===1)?'0'+seconds:seconds;
                  return minutes+':'+(seconds);
                }
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

    //detalle 3
    $scope.prepareData3 = function(data){
      _.each(data,function(d){
        d.mes_date = d.mes+'-01';
        d.linea_a = parseInt(d.linea_a);
        d.linea_b = parseInt(d.linea_b);
        d.linea_c = parseInt(d.linea_c);
        d.linea_d = parseInt(d.linea_d);
        d.linea_e = parseInt(d.linea_e);
        d.linea_h = parseInt(d.linea_h);
        d.premetro = parseInt(d.premetro);
        d.anio = parseInt(d.anio);
      });
      $scope.data3 = data;
      $scope.selectedYear = 2017;
      $scope.selectOptions = _.map(_.groupBy(data, 'anio'),function(v,k){return parseInt(k); });
      return $scope.getFilteredData();
    };

    $scope.changeOption = function(){
      chart3.load(
        angular.merge($scope.dataConfig,{
          json: $scope.getFilteredData()
        })
      );
    };

    $scope.getFilteredData = function(){
      return _.filter($scope.data3, {'anio':$scope.selectedYear});
    };

    $scope.completeConfig3 = function(config){
      $scope.dataConfig = {
        keys: {
              value: ['linea_a','linea_b','linea_c','linea_d','linea_e','linea_h','premetro'],
              x: 'mes_date'
          },
          names:{
            'linea_a':'Línea A',
            'linea_b':'Línea B',
            'linea_c':'Línea C',
            'linea_d':'Línea D',
            'linea_e':'Línea E',
            'linea_h':'Línea H',
            'premetro':'Premetro'
          },
          type: 'spline',
          colors: {
            'linea_a': "rgb(0, 174, 219)",
            'linea_b': "rgb(238, 27, 46)",
            'linea_c': "rgb(1, 103, 178)",
            'linea_d': "rgb(0, 128, 103)",
            'linea_e': "rgb(108, 33, 128)",
            'linea_h': "rgb(255, 210, 3)",
            'premetro': "rgb(200, 200, 3)"
          }

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
              show:true,
              tick: {
                  format: '%m-%Y'
              }
          },
          y: {
              show:true,
              tick: {
                format: function (millones) {
                  return (millones+'').replace('000000','m');
                }
              }
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady3 = function(chart,id){
      chart3 = chart;
      $( "<div id='selector-container'></div>" ).insertBefore( "#"+id );
      var templateUrl = $sce.getTrustedResourceUrl('views/includes/selector.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#selector-container').html(template).contents())($scope);
      }, function() {
          // An error has occurred
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
