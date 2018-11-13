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
      $scope.currentCompromise.thridColor = '#51fbec';
      $scope.currentCompromise.fourthColor = '#4e948e';
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

    $scope.completeConfig = function(config){
      return angular.merge(config,{
        data:{
          xFormat: '%Y-%m',
          type: 'bar',
          keys: {
              value: ['subte', 'colectivo', 'via_publica' ,'total'],
              x:'mes'
          },
          names: {
            'subte': 'Subte', 
            'colectivo': 'Colectivo',
            'via_publica': "Via Pública",
            'total': "Total"
          },
          colors: {
            'subte': $scope.currentCompromise.color, 
            'colectivo': $scope.currentCompromise.secondColor,
            'via_publica': $scope.currentCompromise.thridColor,
            'total': $scope.currentCompromise.fourthColor
          }
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
