'use strict';

angular.module('compromisosSiteApp')
  .controller('Compromiso02Ctrl', function (UrlService,$compile,$templateRequest, $scope, $http,SlugColorService,LoadSVGService, $sce) {

    var url = UrlService.getUrlByPage('home');
    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.loading = true;

    $http.jsonp(url)
    .success(function(data){
      $scope.currentCompromise = $scope.data = _.find(data, function(d){ return parseInt(d.numero) === 2; });
      $scope.currentCompromise.color = SlugColorService.getColorBySlug($scope.currentCompromise.slug);
      $scope.currentCompromise.porcentaje_completado = parseInt($scope.currentCompromise.porcentaje_completado);
      $scope.loading = false;
      LoadSVGService.loadIcon($scope.currentCompromise.icono,function(iconLoaded){
        $('.icon-svg-container').html(iconLoaded.cloneNode(true));
      });
    });

    var chart2,chart2Data,chart2Columns;

    //Detalle 1

    $scope.prepareData1 = function(data){
      data.map(function(d){
        d.trimestre = d.anio + '-' + parseInt(d.trimestre)*3 + '-01';
        return d;
      }); //trimestres
      return data;
    };

    $scope.completeConfig1 = function(config){
      return angular.merge(config,{
        data:{
          type: 'spline',
          keys: {
              value: ['meta_modelada','reciclado_real'],
              x:'trimestre'
          },
          names: {
            reciclado_real: 'Reciclado Real',
            meta_modelada: 'Meta Modelada'
          },
          colors: {
            'reciclado_real':$scope.currentCompromise.color,
            'meta_modelada':'#ccc'
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
          x: {
              type: 'timeseries',
              show:true,
              tick:{
                format: function(x){
                  return ((x.getMonth()+1)/3) +'-'+x.getFullYear(); //trimestres
                }
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

    /*$scope.chartReady1 = function(chart,id){
    };*/


    //Detalle 2

    $scope.prepareData2 = function(data){
      $scope.selectedPeriodo = 'mayo_2016';
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
              max:14000
          }
        },
        legend: {
            show: false
        }
        
      });
    };

    $scope.chartReady2 = function(chart,id){
      chart2 = chart;
      $( "<div id='selector-container'></div>" ).insertAfter( "#"+id );
      var templateUrl = $sce.getTrustedResourceUrl('views/includes/selectorPeriodos.html');
      $templateRequest(templateUrl).then(function(template) {
        $compile($('#selector-container').html(template).contents())($scope);
      }, function() {
        // An error has occurred
      });
    };

    $scope.changeOption = function(){
      chart2.load(
        angular.merge($scope.dataConfig,{
          json: parseData()
        })
      );
    };

    
  });
