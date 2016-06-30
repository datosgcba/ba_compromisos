'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso20Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce,FormatService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    var treeIcon,data3;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 20; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        treeIcon = iconLoaded;
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart1,chart1Id,chart1Data;
    var chart2,chart2Config,chart2Id,chart2Data;

    //Detalle 1

    $scope.prepareData1 = function(data){
      data.map(function(d){
        return d.mes += '-01';
      })
      console.log(1,data);
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          type: 'line',
          keys: {
              value: ['cantidad_iniciativas','meta_acumulado'],
              x:'mes'
          },
          colors: {
            'cantidad_iniciativas':$scope.currentCompromise.color,
            'meta_acumulado':'#ccc'
          }
        },
        point: {
            show: false
        },
        size: {
            height: 300,
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 10,
            left: 30,
        },
        axis: {
          rotated:false,
          x: {
              type: 'timeseries',
              show:true,
              tick: {
                format: FormatService.month
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

    $scope.chartReady1 = function(chart,id){
      //do nothing
    };


    //Detalle 2

    $scope.dataLoaded2 = function(id,data){
      console.log(2,data);

      setTimeout(function(){
        //createCustomChart1();
      },1000);
    };

    function createCustomChart2(){

    }

    //Detalle 4
    
    $scope.dataLoaded4 = function(id,data){
      console.log(4,data);

      /*$scope.bubbleId = id;
      $scope.bubbleConfig = {
        color: $scope.currentCompromise.color
      };

      var total = d3.sum(data,function(d){return parseInt(d.hectareas)});

      $scope.bubbleData = { 
                    name:"total",
                    children:[]
                  };


      _.each(data,function(d){
        $scope.bubbleData.children.push({
          name: d.tipo,
          data: Math.round((parseInt(d.hectareas)*100)/total) + '%',
          value: parseInt(d.hectareas),
          children : []
        });
      });

      var templateUrl = $sce.getTrustedResourceUrl('views/includes/bubble.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#'+id).html(template).contents())($scope);
      });*/

    };
  	
  });
