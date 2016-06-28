'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso12Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 12; });
      $scope.currentCompromise.slug = SlugColorService.getCategorySlug($scope.currentCompromise.categoria);
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        treeIcon = iconLoaded;
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart = {},chartData = {};

    //detalle 1
    $scope.dataLoaded = function(id,data){
      var mid = Math.ceil(data.length / 2);
      var parts = _.chunk(data, mid);
      chartData = {
        'chart-escuelas-1': parts[0],
        'chart-escuelas-2': parts[1]
      };

      $( "#"+id ).append("<div id='chart-escuelas-1'></div>");
      $( "#"+id ).append("<div id='chart-escuelas-2'></div>");

      console.log(data);
      setTimeout(function(){
        createCustomChart('chart-escuelas-1');
        createCustomChart('chart-escuelas-2');
      },1000);
    };

    function createCustomChart(id){
      var w = $('#'+id).width();
      var h = 150;
      var barW = w/chartData[id].length;
      var pad = barW*0.1;

      var yScale = d3.scale.linear()
          .domain([0,100])
          .range([0,h-barW-barW/2]);

      if(!chart[id]){
        chart[id] = {};
        chart[id].svg = d3.select('#'+id)
          .append('svg')
          .classed('vertical-bar-svg',true);

        chart[id].detail = d3.select('#'+id)
          .append('div')
          .attr('id','vertical-bar-detail');

        chart[id].main = chart[id].svg.append('g')
          .classed('vertical-bar-g-main',true);
      }

      chart[id].svg.attr('height',h).attr('width',w);

      chart[id].bars = chart[id].main.selectAll('.vertical-bar-g')
          .data(chartData[id]);

      chart[id].bars.enter()
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
                $scope.selectedPlaza = chartData[id][d.ix];
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

      chart[id].bars
        .attr('transform', function(d,i){
            return 'translate('+i*barW+',0)';
            });

      chart[id].bars.selectAll('text.vertical-bar-text')
        .attr('x',barW/2)
        .attr('y',h-(barW/4)+pad/2);

      chart[id].bars.selectAll('rect.vertical-bar-bg')
        .attr('width',barW);

      chart[id].bars.selectAll('rect.vertical-bar-event')
        .attr('width',barW-2);

      chart[id].bars.selectAll('g.vertical-bar-icon svg')
        .attr('width', barW)
        .attr('height', barW);

      chart[id].bars.selectAll('rect.vertical-bar-fill')
        .attr('height',h-barW-barW/2)
        .attr('y',barW)
        .attr('x',pad)
        .attr('width',barW-pad*2);

      chart[id].bars.selectAll('rect.vertical-bar-value')
        .attr('height',function(d){
          return yScale(parseInt(d.avance)); 
        })
        .attr('y',function(d){
          return barW+ (h-barW-barW/2)- yScale(parseInt(d.avance)); 
        })
        .attr('x',pad)
        .attr('width',barW-pad*2);

    }

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          if(chart){
            createCustomChart('chart-escuelas-1');
            createCustomChart('chart-escuelas-2');
          }          
        }, 500);
    });
  	
  });
