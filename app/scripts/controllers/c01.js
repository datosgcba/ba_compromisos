'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso01Ctrl', function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {

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
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);

      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
      //console.log($scope.currentCompromise);;
    });

    var colorMeta = '#bdbec2';

    //1
    $scope.prepareData1 = function(data){
     return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%m-%Y',

          types: {
            meta: 'area',
            baches_resueltos: 'line',
          },
          keys: {
              value: ['meta','baches_resueltos'],
              x:'mes'
          },
          names: {
            baches_resueltos: 'Baches resueltos',
            meta: 'Meta',
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
            left: 40,
        },
        axis: {
          x: {
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b"),
                  count:6
              }
          },
          y: {
              show:true,
              min: 0,
              max:100,
              padding: 5,
              tick:{
                format:function(y){
                  return y+'%';
                }
              }
          }
        },
        legend: {
            show: true
        }
      });
    };


    //2
    $scope.prepareData2 = function(data){
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%m-%Y',
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
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b"),
                  count:6
              }
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


    //3
    $scope.dataLoaded3 = function(id,data){

      $scope.autosConfig = {
        icono:'subte',
        orientacion: 'cols',
        base:{
          titulo: data[0].detalle,
          color: '#cccccc',
          cantidad: 100
        },
        opciones:[
          {
            titulo: data[1].detalle,
            color: $scope.currentCompromise.color,
            cantidad:Math.round(parseInt(data[1].cantidad)*100/parseInt(data[0].cantidad))
          }
        ]
      };
      var templateUrl = $sce.getTrustedResourceUrl('views/includes/autitos.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#'+id).html(template).contents())($scope);
      });
      console.log(3,id,data);
      return data;
    };

  });
