'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso46Ctrl', function (UrlService, $scope,$rootScope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 46; });
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

     $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          types: {
            meta: 'area',
            nuevos: 'line',
          },
          keys: {
              value: ['meta','nuevos'],
              x:'trimestre'
          },
          names: {
            nuevos: 'Nuevos',
            meta: 'Meta',
          },
          colors: {'meta':$scope.currentCompromise.secondColor,
                    'nuevos': $scope.currentCompromise.color}
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
              min: 0,
              padding: 5,

          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){

    };

  $scope.prepareData2 = function(data){
      return data;
    };

       //detalle 2
    $scope.dataLoaded2 = function(id,data){

      $scope.bubbleId = id;
      $scope.bubbleConfig = {
        color: $scope.currentCompromise.color
      };

      var total = d3.sum(data,function(d){return parseInt(d.cantidad)});

      $scope.bubbleData = {
                    name:"total",
                    children:[]
                  };


      _.each(data,function(d){
        $scope.bubbleData.children.push({
          name: d.tipo,
          data: Math.round((parseInt(d.cantidad)*100)/total) + '%',
          value: parseInt(d.cantidad),
          children : []
        });
      });

      var templateUrl = $sce.getTrustedResourceUrl('views/includes/bubble.html');
      $templateRequest(templateUrl).then(function(template) {
          $compile($('#'+id).html(template).contents())($scope);
      });

    };

    $scope.chartReady2 = function(chart){

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
