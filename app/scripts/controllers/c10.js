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

    var chart2;

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 10; });
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.secondColor = '#bdbec2';
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,$scope.currentCompromise.porcentaje_completado,function(iconLoaded){

        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
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
            'variacion_interanual': 'Continúan (por año)',
            'variacion_acumulada': 'Continúan (acumulado)',
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

    $scope.chartReady1 = function(){

    };

    //detalle 2
    $scope.prepareData2 = function(data){
      $scope.labels = _.keys(data[0]);
      _.remove($scope.labels, function (d) {
        return _.indexOf(['anio','CV'], d) !== -1;
      });
      $scope.origLabels = angular.copy($scope.labels);
      $scope.colors = {};
      $scope.labels.forEach(function(d){
        $scope.colors[d] = "#e6e6e6";
      });
      $scope.selectedProv = $scope.labels[0];
      return data;
    };

    $scope.selectedColorPalette = function(){
      var colors = angular.copy($scope.colors);
      if($scope.selectedProv){
        colors[$scope.selectedProv] = $scope.currentCompromise.color;
      }
      return colors;
    };

    $scope.completeConfig2 = function(config){
      $scope.selectOptions = $scope.origLabels;
      $scope.dataConfig = {
        keys: {
              value: $scope.selectOptions,
              x: 'anio'
          },
          type: 'spline',
          colors: $scope.selectedColorPalette()
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
            left: 30,
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
            show: false
        }
      });
    };

    $scope.chartReady2 = function(chart,id){
      $scope.classesLabels = {};
      $scope.labels.forEach(function(e,i){
        $scope.classesLabels[$scope.origLabels[i]] = e.replace(/[\s?!@#$%^&*()_=+,.<>'":;\[\]\/|~`{}\\]/g, '-');
      });

      var slug = $scope.classesLabels[$scope.selectedProv];
      $('.c3-lines path').css('stroke-width','1px');
      $('.c3-lines-'+slug+' path').css('stroke-width','5px');

      chart2 = chart;

      $( "<div id='selector-container'></div>" ).insertAfter( "#"+id );
      var templateUrl = $sce.getTrustedResourceUrl('views/includes/selectorProvincias.html');
      $templateRequest(templateUrl).then(function(template) {
        $compile($('#selector-container').html(template).contents())($scope);
      }, function() {
        // An error has occurred
      });
    };

    $scope.changeOption = function(){
      chart2.load(
        angular.merge($scope.dataConfig,{
          colors: $scope.selectedColorPalette()
        })
      );
      var slug = $scope.classesLabels[$scope.selectedProv];
      $('.c3-lines path').css('stroke-width','1px');
      $('.c3-lines-'+slug+' path').css('stroke-width','5px');
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
