'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso18Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$templateRequest,$compile) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 18; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
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

    
    //detalle 2

    $scope.prepareData2 = function(data){
      var traspose = {};
      angular.forEach(data,function(d){
        var keys = _.reject(_.keys(d),function(o) { return o=='especialidad'; });
        angular.forEach(keys,function(v){
          if(!traspose[v]){
            traspose[v] = {}
          }
          traspose[v][d.especialidad] = parseInt(d[v]);
        });
      });

      var finalData = []
      angular.forEach(traspose,function(d,v){
        $scope.values = _.keys(d);
        finalData.push(angular.merge(d,{anio:v}));
      });
      return finalData;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'line',
          keys: {
              value: $scope.values,
              x:'anio'
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
          rotated:false,
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

    $scope.chartReady2 = function(chart){

    };

  	
  });
