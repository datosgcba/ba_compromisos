'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso35Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    var treeIcon,data3;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 35; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,function(iconLoaded){
        treeIcon = iconLoaded;
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart1,chart1Id,chart1Data;
    var chart2,chart2Config,chart2Id,chart2Data;

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
      var pad = barW*0.2;

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
                $scope.selectedIcon = chart1Data[d.ix];
                d3.selectAll('.vertical-bar-g').classed('categoria-unselected',true).classed('categoria-selected',false);
                d3.selectAll('.vertical-bar-g#vertical-bar-g-'+d.ix).classed('categoria-unselected',false).classed('categoria-selected',true);
                var templateUrl = $sce.getTrustedResourceUrl('views/includes/cimDetail.html');
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
          var value = (d.avance)?d.avance:0;
          return yScale(parseInt(value));
        })
        .attr('y',function(d){
          var value = (d.avance)?d.avance:0;
          return barW+ (h-barW-barW/2)- yScale(parseInt(value));
        })
        .attr('x',pad)
        .attr('width',barW-pad*2);

    }

    $scope.completeConfig2 = function(config){
      return angular.merge(config,{
        data:{
          type: 'bar',
          keys: {
              value: ['grupos','asesoramiento_legal','patrocinio_letrado','asistencia_psicologica','talleres_cursos admision','otros','total'],
              x: 'anio'
          },
          groups: [
            ['grupos','asesoramiento_legal','patrocinio_letrado','asistencia_psicologica','talleres_cursos admision','otros','total']
          ],
          names: {
            grupos:'Grupos' ,
            asesoramiento_legal:'Asesoramiento Legal' ,
            patrocinio_letrado:'Patrocinio Letrado' ,
            asistencia_psicologica:'Asistencia Psicológica' ,
            talleres_cursos:'Talleres Cursos' ,
            admision:'Admisión' ,
            otros:'Otros' ,
            total:'Total'
          },
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
              type: 'category',
              show:true,
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
          if(chart1){
            createCustomChart1();
          }
        }, 500);
    });

  });
