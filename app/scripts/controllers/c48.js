'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('Compromiso48Ctrl', function (UrlService, $scope, $http,SlugColorService,LoadSVGService,$sce,$compile,$templateRequest) {

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
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 48; });
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

    $scope.completeConfig = function(config){

      return angular.merge(config,{
        data:{
          types: {
            personas : 'line'
          },
          keys: {
              value: [ 'personas'],
              x: 'trimestre'
          },
          names: {
            personas: 'Personas'
          },
          colors: {
                'personas': $scope.currentCompromise.color
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
              type: 'category',
              show:true,

          },
          y: {
            show:true,
            max:199
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady = function(chart){

    };

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
            left: 50,
        },
        axis: {
          rotated:true,
          x: {
              type: 'category',
              show:true
          },
          y: {
              show:true,
              max:19
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

    $scope.prepareData3 = function(data){
      return data;
    };

    $scope.completeConfig3 = function(config){

      return angular.merge(config,{
        data:{
          types: {
            avance : 'line'
          },
          keys: {
              value: ['avance'],
              x: 'trimestre'
          },
          names: {
            avance: 'Avance'
          },
          colors: {

                'avance': $scope.currentCompromise.color
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
              type: 'category',
              show:true,

          },
          y: {
            show:true,
            max:199
          }
        },
        legend: {
            show: true
        }
      });
    };

    $scope.chartReady3 = function(chart){

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
