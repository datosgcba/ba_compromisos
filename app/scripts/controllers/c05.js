'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso05Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 5; });
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        treeIcon = iconLoaded;
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
      },1000);
    };

    function createCustomChart1(){
      var w = $('#'+chart1Id).width();
      var h = 300;
      var barW = w/chart1Data.length;
      var pad = barW*0.1;

      var yScale = d3.scale.linear()
          .domain([0,100])
          .range([0,h-barW-barW/2]);

      if(!chart1){
        chart1 = {};
        chart1.svg = d3.select('#'+chart1Id)
          .append('svg')
          .classed('vertical-bar-svg',true);

        chart1.detail = d3.select('#'+chart1Id)
          .append('div')
          .attr('id','vertical-bar-detail');

        chart1.main = chart1.svg.append('g')
          .classed('vertical-bar-g-main',true);
      }

      chart1.svg.attr('height',h).attr('width',w);

      chart1.bars = chart1.main.selectAll('.vertical-bar-g')
          .data(chart1Data);

      chart1.bars.enter()
        .append('g')
        .attr('id',function(d,i){
          return 'vertical-bar-g-'+i;
        })
        .classed('vertical-bar-g',true)
        .classed('categoria-'+$scope.currentCompromise.slug,true)
        .classed('categoria-unselected',true)
        .each(function(d,i){
          var group = d3.select(this);
          //bg
          group
            .datum({ix:i})
            .append('rect')
            .classed('vertical-bar-bg',true)
            .attr('height',h);

          //icon
          var icon = $(treeIcon)
                    .attr('width', barW)
                    .attr('height', barW)
                    .get(0);
          group
            .append("g")
            .classed('vertical-bar-icon',true)
            .each(function(){
                this.appendChild(icon.cloneNode(true));
            });

          group
            .append("rect")
            .classed('vertical-bar-fill',true)
            .attr('fill','#ccc');

          group
            .append("rect")
            .classed('vertical-bar-value',true)
            .classed('fill-color',true)
            .datum(d)
            .attr('fill',$scope.currentCompromise.color);

          group
            .append('text')
            .classed('vertical-bar-text',true)
            .attr('text-anchor','middle')
            .text(function(){
              return (d.avance)?d.avance+'%':'0%';
            });

          group
            .datum({ix:i})
            .append('rect')
            .classed('vertical-bar-event',true)
            .classed('handy',true)
            .attr('x',1)
            .attr('y',1)
            .attr('height',h-2)
            .attr('stroke','#fff')
            .attr('stroke-width',2)
            .attr('fill','transparent')
            .on("mouseover",function(){
            })
            .on("mouseout",function(){
            })
            .on("click", function(d){
                $scope.selectedPlaza = chart1Data[d.ix];
                d3.selectAll('.vertical-bar-g').classed('categoria-unselected',true).classed('categoria-selected',false);
                d3.selectAll('.vertical-bar-g#vertical-bar-g-'+d.ix).classed('categoria-unselected',false).classed('categoria-selected',true);
                var templateUrl = $sce.getTrustedResourceUrl('views/includes/plazaDetail.html');
                $templateRequest(templateUrl).then(function(template) {
                    $compile($('#vertical-bar-detail').html(template).contents())($scope);
                }, function() {
                    // An error has occurred
                });
            });

        });

      chart1.bars
        .attr('transform', function(d,i){
            return 'translate('+i*barW+',0)';
            });

      chart1.bars.selectAll('text.vertical-bar-text')
        .attr('x',barW/2)
        .attr('y',h-(barW/4)+pad/2);

      chart1.bars.selectAll('rect.vertical-bar-bg')
        .attr('width',barW);

      chart1.bars.selectAll('rect.vertical-bar-event')
        .attr('width',barW-2);

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

    }

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
      data3 = data;
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
        },
        bar: {
            width: {
                ratio: 0.8 // this makes bar width 50% of length between ticks
            }
        },
        grid: {
            y: {
                lines: [
                    {value: 9, text: 'Mínimo recomendado por la OMS: 9m²', position: 'middle'},
                ]
            }
        }
      });
    };

    $scope.chartReady3 = function(chart,id){
      var container = d3.select('.c3-texts');
      d3.selectAll('#'+id+' .c3-event-rect').each(function(d){
        var dato = data3[d.index];
        var bar = d3.select(this);
        var offset = parseInt(bar.attr('height')/2);
        container
          .append('text')
          .attr('alignment-baseline','middle')
          .classed('custom-c3-text',true)
          .attr('x',parseInt(bar.attr('x'))+10)
          .attr('y',parseInt(bar.attr('y'))+offset)
          .text(dato.ciudad+': '+dato.metros_habitante+' m²');
      });
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
