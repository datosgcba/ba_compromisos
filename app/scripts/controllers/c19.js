'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso19Ctrl',  function (UrlService,$rootScope, $scope, $http,SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {

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
      $scope.currentCompromise.porcentaje_completado_2 = parseInt($scope.currentCompromise.cumplimiento_2_porcentaje_completado);

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

      console.log(data);

      angular.forEach(data,function(d,ix){

        var color = (ix==0)?$scope.currentCompromise.color:'#cccccc';
        
        $scope.mediConfig.push({
          icono:'hombre',
          orientacion: 'rows',
          items: parseInt(d.equipos),
          base:{
            titulo: '',
            color: color,
            cantidad: parseInt(d.equipos)
          },
          opciones:[
            {
              titulo: '',
              color: color,
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


  

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%Y-%m',
          type: 'bar',
          keys: {
              value: ['cantidad','acumulado'],
              x: 'fecha'
          },
          names: {
            cantidad: 'Nuevos',
            acumulado: 'Acumulado '
          },
          colors: {'acumulado':$scope.currentCompromise.secondColor,
                    'cantidad': $scope.currentCompromise.color}
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 80,
        },
        axis: {
           x: {
              type: 'timeseries',
              show:true,
              tick: {
                  fit: true,
                  format: $rootScope.d3Locale_ES.timeFormat("%b-%y"),
              }
          },
          y: {
              show:true,
              min: 0,
              padding: {top:0, bottom:0}
          }
        },
        legend: {
            show: true
        }
      });
    };
    $scope.prepareData2 = function(data){
      return data;
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
