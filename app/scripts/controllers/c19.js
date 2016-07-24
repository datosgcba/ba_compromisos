'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso19Ctrl',  function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 19; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });
//Detalle 1
    $scope.dataLoaded1 = function(id,data){
      $scope.medicos = data;
      $scope.mediConfig = [];

      angular.forEach(data,function(d){
        $scope.mediConfig.push({
          icono:'hombre',
          orientacion: 'rows',
          items: 20,
          base:{
            titulo: '',
            color: '#cccccc',
            cantidad: parseInt(d.equipos)
          },
          opciones:[ 
            {
              titulo: '',
              color: $scope.currentCompromise.color,
              cantidad: parseInt(d.equipos)
            }
          ]
          
        })
      });

      var templateUrl = $sce.getTrustedResourceUrl('views/includes/medicos.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#'+id).html(template).contents())($scope);
      });
    };


    $scope.prepareData2 = function(data){
      return data;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%Y',
          types: {
            cantidad_consultas : 'line'
          },
          names: {
            cantidad_consultas: 'Cantidad de Consultas',
          },
          keys: {
              value: ['cantidad_consultas'],
              x: 'anio'
          },
          colors: {
                'cantidad_consultas': $scope.currentCompromise.color}
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
                  format: '%Y'
              }
          },
          y: {
            show:true,
            min: 500,
            count:4,
            tick: {
                  min: 0,
                  fit: true
            }
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady2 = function(chart){

    };
    

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){          
        }, 500);
    });

  	
  });
