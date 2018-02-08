'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso39Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    var treeIcon,data3;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 39; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.numero,$scope.currentCompromise.porcentaje_completado,function(iconLoaded){

        treeIcon = iconLoaded;
        $(iconLoaded)
            .attr('width', '100%')
            .attr('height', '100%')
            .get(0);
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
          .style("width", "300px")
          .style("margin", "0 auto")
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
                var templateUrl = $sce.getTrustedResourceUrl('views/includes/c39detail.html');
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

//.-------------------
var chart2,chart2Data,chart2Columns;

$scope.prepareData2 = function(data){
  $scope.selectedPeriodo = 'progreso';
  $scope.selectOptions = _.without(_.keys(data[0]),'comuna','punto_verde');
  $scope.selectOptions = $scope.selectOptions.map(function(l){
    return {label:l.toUpperCase().replace('_',' '),value:l};
  });
  chart2Data = d3.nest()
        .key(function(d){return d.comuna;})
        .entries(data);

  return parseData();
};

function parseData(){
  var mes = $scope.selectedPeriodo;
  var centrosRange = d3.range(0,d3.max(chart2Data,function(d){return d.values.length;}));
  chart2Columns = centrosRange.map(function(i){
    return 'c'+(i+1);
  });
  var finalData = [];
  finalData = chart2Data.map(function(e){
    var obj = {comuna:e.key};
    angular.forEach(centrosRange,function(i){
      if(e.values[i]){
        obj['c'+(i+1)] = (e.values[i][mes])?parseFloat(e.values[i][mes]):0;
      } else {
        obj['c'+(i+1)] = 0;
      }
    });
    return obj;
  });
  return finalData;
}

$scope.completeConfig2 = function(config){
  var colors = {};
  var nextColor = $scope.currentCompromise.color;
  chart2Columns.forEach(function(e){
    colors[e] = nextColor;
    nextColor = d3.rgb(nextColor).darker().toString();
  });
  $scope.dataConfig = {
      type: 'bar',
      keys: {
          value: chart2Columns,
          x:'comuna'
      },
      colors: colors,
      groups: [
          chart2Columns
      ]
    };
  return angular.merge(config,{
    data: $scope.dataConfig,
    tooltip: {
        grouped: true,
        format: {
            title: function (d) { return 'Comuna ' + (d+1); },
            name: function (name, ratio, id, index) {
              var values = chart2Data[index].values;
              if(values[parseInt(name.replace('c',''))-1]){
                return values[parseInt(name.replace('c',''))-1].punto_verde;
              }
              return '';
            },
            value: function (value) {
                if(value!==0){
                  return value;
                }
                return '';
            }
        },
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
            var $$ = this, config = $$.config,
                titleFormat = config.tooltip_format_title || defaultTitleFormat,
                nameFormat = config.tooltip_format_name || function (name) { return name; },
                valueFormat = config.tooltip_format_value || defaultValueFormat,
                text, i, title, value, name, bgcolor;
            for (i = 0; i < d.length; i++) {
                if (! (d[i] && (d[i].value || d[i].value === 0))) { continue; }

                if (! text) {
                    title = titleFormat ? titleFormat(d[i].x) : d[i].x;
                    text = "<table class='" + $$.CLASS.tooltip + "'>" + (title || title === 0 ? "<tr><th colspan='2'>" + title + "</th></tr>" : "");
                }

                name = nameFormat(d[i].name, d[i].ratio, d[i].id, d[i].index);
                value = valueFormat(d[i].value, d[i].ratio, d[i].id, d[i].index);
                value = (name!=='' && value==='')?0:value;
                bgcolor = $$.levelColor ? $$.levelColor(d[i].value) : color(d[i].id);
                bgcolor = (name==='')?'white':bgcolor;

                text += "<tr class='" + $$.CLASS.tooltipName + "-" + d[i].id + "'>";
                text += "<td class='name'><span style='background-color:" + bgcolor + "'></span>" + name + "</td>";
                text += "<td class='value'>" + value + "</td>";
                text += "</tr>";
            }
            return text + "</table>";
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
      rotated:true,
      x: {
          type: 'category',
          show:true
      },
      y: {
          show:true,
          max:180
      }
    },
    legend: {
        show: false
    }

  });
};

$scope.chartReady2 = function(chart,id){
  chart2 = chart;

};
//.-------------------
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
