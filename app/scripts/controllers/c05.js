'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso05Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService) {

  	var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    //para ir a otra url en el padre  
    //pymChild.navigateParentTo('https://github.com/nprapps/pym.js');

    $scope.loading = true;

    var treeIcon;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 5; });
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        treeIcon = iconLoaded;
        /*$(iconLoaded)
            .attr('width', 50)
            .attr('height', 50)
            .get(0);*/
        $('#icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart1,chart1Id,chart1Data;

    //detalle 1
    $scope.dataLoaded = function(id,data){
      chart1Id = id;
      chart1Data = data;
      setTimeout(function(){
        createCustomChart1();
      },500);
    };

    function createCustomChart1(){
      console.log(chart1Data);
      var w = $('#'+chart1Id).width();
      var h = 300;
      var barW = w/chart1Data.length;
      var pad = 10;

      var yScale = d3.scale.linear()
          .domain([0,100])
          .range([0,h-barW-barW/2]);

      if(!chart1){
        chart1 = {};
        chart1.svg = d3.select('#'+chart1Id)
          .append('svg')
          .classed('vertical-bar-svg',true);

        chart1.main = chart1.svg.append('g')
          .classed('vertical-bar-g-main',true);
      }

      chart1.svg.attr('height',h).attr('width',w);

      chart1.bars = chart1.main.selectAll('.vertical-bar-g')
          .data(chart1Data);

      chart1.bars.enter()
        .append('g')
        .classed('vertical-bar-g',true)
        .each(function(d,i){
          var group = d3.select(this);
          //bg
          group
            .datum({ix:i})
            .append('rect')
            .classed('vertical-bar-bg',true)
            .attr('height',h)
            .attr('fill','red');

          //icon
          var icon = $(treeIcon)
                    .attr('width', barW)
                    .attr('height', barW)
                    .get(0);
          group
            .append("g")
            .classed('vertical-bar-icon',true)
            .each(function(d){
                this.appendChild(icon.cloneNode(true));
            });

          group
            .append("rect")
            .classed('vertical-bar-fill',true)
            .attr('fill','grey');

          group
            .append("rect")
            .classed('vertical-bar-value',true)
            .datum(d)
            .attr('fill','green');

        });

      chart1.bars
        .attr('transform', function(d,i){
            return 'translate('+i*barW+',0)'
            });


      chart1.bars.selectAll('rect.vertical-bar-bg')
        .attr('width',barW);

      chart1.bars.selectAll('g.vertical-bar-icon svg')
        .attr('width', barW)
        .attr('height', barW);

      chart1.bars.selectAll('rect.vertical-bar-fill')
        .attr('height',h-barW-barW/2)
        .attr('y',barW)
        .attr('x',pad)
        .attr('width',barW-pad*2);

      chart1.bars.selectAll('rect.vertical-bar-value')
        .attr('height',function(d){
          return yScale(parseInt(d.avance)); 
        })
        .attr('y',function(d){
          return barW+ (h-barW-barW/2)- yScale(parseInt(d.avance)); 
        })
        .attr('x',pad)
        .attr('width',barW-pad*2);


    };

    //detalle 2

    $scope.prepareData2 = function(data){
      var transformed = { 
                        name:"total",
                        children:[]
                      };

      _.each(data,function(d){
        transformed.children.push({
          name: d.tipo,
          value: parseInt(d.hectareas),
          children : []
        });
      });

      return transformed;
    };

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        valueField: 'hectareas',
        color: $scope.currentCompromise.color
      });
    };

    $scope.chartReady2 = function(chart){

    };

    //detalle 3

    $scope.prepareData3 = function(data){
      return data;
    };

    $scope.completeConfig3 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['metros_habitante'],
              x:'ciudad'
          },
          colors: {'metros_habitante':$scope.currentCompromise.color}
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
          rotated:true,
          x: {
              type: 'category',
              show:false
          },
          y: {
              show:false
          }
        },
        legend: {
            show: false
        }
      });
    };

    $scope.chartReady3 = function(chart){

    };


    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          if(chart1){
            createCustomChart1();
          }          
        }, 500);
    });
  	
  });
