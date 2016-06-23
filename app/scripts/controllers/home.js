'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function ($scope,$timeout,$http,UrlService,SlugColorService,LoadSVGService) {

    $scope.pymChild = new pym.Child({ polling: 1000 });
    $scope.pymChild.sendHeight();

    $scope.data = [];
    $scope.loading = true;
    $scope.charts = {};

    $scope.selectedGroup = 'home';

    var url = UrlService.getUrlByPage('home');

    $http.jsonp(url)
    .success(function(data){
      $scope.data = data.map(function(c){
        c.slug = SlugColorService.getCategorySlug(c.categoria);
        return c;
      });
      $scope.loading = false;
      $scope.groupData();
      $scope.renderCharts();
    });

    $scope.groupData= function(){
      $scope.categoriesGroup = d3.nest()
        .key(function(d) { return d.slug; })
        .entries($scope.data);

      $scope.categoriesGroupText = d3.nest()
        .key(function(d) { return d.categoria; })
        .entries($scope.data);

      $scope.availableCategories = [];
        angular.forEach($scope.categoriesGroup, function(g){
           $scope.availableCategories.push(g.key);
        });
      angular.forEach($scope.categoriesGroup, function(g){
    
          g.finishedYearsGroup = d3.nest()
          .key(function(d) { return d.cumplimiento1; })
          .rollup(function(leaves) { return leaves.length; })
          .entries(g.values);
      });

      $scope.finishedYearsGroup = d3.nest()
        .key(function(d) { return d.cumplimiento1; })
        .entries($scope.data);

      angular.forEach($scope.finishedYearsGroup, function(g){
         g.categoryGroup = d3.nest()
          .key(function(d) { return SlugColorService.getCategorySlug(d.categoria); })
          .rollup(function(leaves) { return leaves.length; })
          .entries(g.values);
      });
      $scope.availableYears = [];
      angular.forEach($scope.finishedYearsGroup, function(g){
         $scope.availableYears.push(g.key);
      });
      $scope.availableYears = $scope.availableYears.sort();

      $scope.finishedPercentageGroup = d3.nest()
        .key(function(d) { return getPercentageGroup(d);})
        .entries($scope.data);    
 
      /*console.log($scope.categoriesGroup);
      console.log($scope.finishedYearsGroup);
      console.log($scope.finishedPercentageGroup);*/

    };
    
    var groups=[];
    groups.push({from:0,to:25});
    groups.push({from:25,to:50});
    groups.push({from:50,to:75});
    groups.push({from:75,to:100});

    function getPercentageGroup(d){
      var group = 0;
      for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        var p = parseInt(d.porcentaje_completado);
        if (p >= g.from &&  p < g.to){
          group= i;
          break;
        }
      }
      d.percentageGroup = group;
      return group;
    }

    $scope.renderCharts = function(){

      bindEvents();
      renderHomeChart();
      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();
      
      
    };


    function showDetail(c,localEvent,mouseEvent){
      $scope.$apply(function(){
        $scope.currentCompromise = c;  
      });

      var popupH = parseInt( d3.select('#compromiso-detail').style('height').replace('px','') );
      var docH = parseInt( $(window).height() );
      var yOffset = parseInt ( mouseEvent.clientY );

      d3.select('#compromiso-detail').style('top',mouseEvent.clientY+'px');
      var filler = yOffset + popupH - docH;
      if(filler>0){
        d3.select('#filler').style('height',filler+'px');
      }
    }

    $scope.redirectParent = function(url){
      $scope.pymChild.navigateParentTo(url);
    };
    
    $scope.closeDetail = function(){
      $scope.currentCompromise = null;
      d3.select('#filler').style('height','0px');
    };

    function renderDateChart(){
      //Get Years
      var mainColumns= ['x'].concat($scope.availableYears);
      //Group by years by category count, 
      angular.forEach($scope.categoriesGroup,function(c){
        c.years = d3.nest()
          .key(function(d) { return d.cumplimiento1; })
          .rollup(function(leaves) { return leaves.length; })
          .entries(c.values);
      });

      var seriesColumns = [];
      seriesColumns.push(mainColumns);
      
      angular.forEach($scope.categoriesGroup,function(c){
        var series = [];
        series.push(c.key);
        angular.forEach($scope.availableYears,function(y){
          //sorry no break :-( for each;
          var count = 0;
          for (var i = 0; i < c.years.length; i++) {
            var yearGroup = c.years[i];
            if (y === yearGroup.key){
              count = yearGroup.values;
              break;
            }
          }
          series.push(count);
        });
        seriesColumns.push(series);
      });
      
      //lines
      var max = d3.max($scope.finishedYearsGroup,function(d){return  d.values.length;});
      var lines = d3.range(0,max+1).map(function(e){return {value:e};});

      $scope.charts.date_chart = c3.generate({
          bindto: '#date_chart',

          data: {
              x : 'x',
              columns: seriesColumns,
              type: 'bar',
              groups: [
                  $scope.availableCategories
              ],
              colors: angular.copy(SlugColorService.getColorBySlug())
          },
          size: {
              height: 220,
          },
          padding: {
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
          },
          legend: {
              show: false
          },
          axis: {
                x: {
                    type: 'category'
                },
                y: {show:false},
            },
          grid: {
              y: {
                  lines: lines
              }
          }
      });
    }

    function renderHomeChart(){
      
      var columns = [];

      angular.forEach($scope.availableCategories,function(e){
        columns.push([e,1,1,1,1,1]);
      });

      //lines
      var max = 4;
      var lines = d3.range(0,max+1).map(function(e){return {value:e};});

      $scope.charts.home_chart = c3.generate({
          bindto: '#home_chart',
          data: {
              columns: columns,
              type: 'bar',
              groups: [
                  $scope.availableCategories
              ],
              colors: angular.copy(SlugColorService.getColorBySlug())
          },
          size: {
              height: 220,
          },
          padding: {
              top: 30,
              right: 30,
              bottom: 30,
              left: 30,
          },
          legend: {
              show: false
          },
          axis: {
                x: {
                    type: 'category',
                    show: false
                },
                y: {
                    show:false,
                    // Range includes padding, set 0 if no padding needed
                    padding: {top:0, bottom:1}
                }
            },
          grid: {
              y: {
                  lines: lines
              }
          }
      });
    }

    function renderStateChart(){
          //Get Years
          var mainColumns= ['x', '0-25%','25-50%','50-75%','75-100%'];
          //Group by years by category count, 
          angular.forEach($scope.categoriesGroup,function(c){
            c.percentages = d3.nest()
              .key(function(d) { return d.percentageGroup; })
              .rollup(function(leaves) { return leaves.length; })
              .entries(c.values);
          });

          var seriesColumns = [];
          seriesColumns.push(mainColumns);
          
            angular.forEach($scope.categoriesGroup,function(c){
              var series = [];
              series.push(c.key);
              angular.forEach(groups ,function(y,k){
                //sorry no break :-( for each;
                var count = 0;
                for (var i = 0; i < c.percentages.length; i++) {
                  var percentageGroup = c.percentages[i];
                  if (k === parseInt(percentageGroup.key)){
                    count = percentageGroup.values;
                    break;
                  }
                }
                series.push(count);
              });
              seriesColumns.push(series);
            });
          
          //lines
          var max = d3.max($scope.finishedPercentageGroup,function(d){return  d.values.length;});
          var lines = d3.range(0,max+1).map(function(e){return {value:e};});

          $scope.charts.state_chart = c3.generate({
              bindto: '#state_chart',
              data: {
                  x : 'x',
                  columns: seriesColumns,
                  type: 'bar',
                   groups: [
                     $scope.availableCategories
                  ],
                  colors: angular.copy(SlugColorService.getColorBySlug())
              },
              size: {
                  height: 220,
              },
              padding: {
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
              },
              legend: {
                  show: false
              },
              axis: {
                    x: {
                        type: 'category'
                    },
                    y: {
                        max: 10,
                        
                        show:false,
                        // Range includes padding, set 0 if no padding needed
                        padding: {top:0, bottom:0}
                    }
                },
              grid: {
                  y: {
                      lines: lines
                  }
              }
          });
    }

    function defaultChartColors(){
      changeChartColors(SlugColorService.getColorBySlug());
    }

    function changeChartColors(colors){
      $scope.charts.state_chart.data.colors(colors);
      $scope.charts.date_chart.data.colors(colors);
      $scope.charts.home_chart.data.colors(colors);

      angular.forEach(colors,function(e,k){
        d3.selectAll('.leaf.'+k+' circle').style('fill',e);
      });
    }

    function selectCategoryChart(slug){
      var colors = {
        'social':"#e6e6e6",
        'convivencia':"#e6e6e6",
        'movilidad':"#e6e6e6",
        'smart':"#e6e6e6"
      };
      colors[slug] = SlugColorService.getColorBySlug(slug);
      changeChartColors(colors);
    }

    function renderCategoryChart(){
        var diameter = 220;
        var pad = ($('#category_chart').width()-diameter) / 2;
        if($('#category_chart').width()<diameter){
          diameter = $('#category_chart').width(); //max size of the bubbles
          pad = 0;
        }

        var pack = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .value(function(d) { 
            return parseInt(d.porcentaje_completado); 
          });

        //setup the chart
        if(!$scope.charts.category_chart){
          
          $scope.charts.category_chart = {};
          
          $scope.charts.category_chart.svg = 
            d3.select("#category_chart")
              .append("svg")
              .attr("class", "bubble-container")
              .attr("width", $('#category_chart').width())
              .attr("height", diameter);

          $scope.charts.category_chart.mainGroup = $scope.charts.category_chart.svg
            .append('g')
            .classed('main',true);

          $scope.charts.category_chart.data = 
              { 
                name:"categories",
                children:[],
              };

          for (var i = 0; i <  $scope.categoriesGroup.length; i++) {
             var c = $scope.categoriesGroup[i];
             $scope.charts.category_chart.data.children.push(
             {
              name: c.key,
              children : c.values, 
             });
          }
            
        }

        $scope.charts.category_chart.svg.attr("width", $('#category_chart').width());
  
        $scope.charts.category_chart.mainGroup.attr("transform", function() 
              { return "translate(" + pad + ",0)"; });

        var nodes = $scope.charts.category_chart.mainGroup
            .datum($scope.charts.category_chart.data)
            .selectAll(".node")
            .data(pack.nodes);

        nodes.enter()
            .append("g")
            .attr("class", function(d) 
              { 
                var what =  d.children ? "node" : "leaf node"; 
                var who = d.slug ? d.slug  : d.name;
                return what + " " + who;
            })
            .each(function(){
              d3.select(this).append("circle")
                .filter(function(d) { return d.name !== "categories"; })
                .style("fill", function(d) 
                  { 
                    return SlugColorService.getColorBySlug(d.slug);
                  });
            });
            
        nodes.attr("transform", function(d) 
              { return "translate(" + d.x + "," + d.y + ")"; });

        nodes.selectAll('circle')
            .attr("r", function(d) { return d.r; });

        /*node.append("title")
            .text(function(d) { return d.name + (d.children ? "" : ": " + parseInt(d.porcentaje_completado)); });*/

        // node.filter(function(d) { return !d.children; }).append("text")
        //     .attr("dy", ".3em")
        //     .style({
        //         "text-anchor": "middle",
        //         "fill":"white", 
        //         "font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
        //         "font-size": "12px"})
        //     .text(function(d) { return d.titulo.substring(0, d.r / 3); });
     

      //d3.select(self.frameElement).style("height", diameter + "px");


    }

    //Render & interact menu chart
    $scope.onChangeCategory = function(){
      if($scope.selectedCategory!==''){
        selectTitle($scope.selectedCategory);
        selectCompromisoItem($scope.selectedCategory);
        selectCategoryChart($scope.selectedCategory);
      } else {
        deselectTitle();
        defaultChartColors();
      }
    };
    $scope.onChangeGroup = function(){
      $scope.groupMenu($scope.selectedGroup);
    };
    $scope.groupMenu = function(type){
      $scope.selectedGroup = type;
      $scope.charts.menu_chart.api.group($scope.selectedGroup);
    };
    function renderMenuChart(){

      var itemSize = 150,
          gap = 5,
          w = $(window).width(),
          h = 500,
          delay = 500,
          smallDevice = (w<768),
          wLabel = w/3;

      var data = angular.copy($scope.data);

      if(!$scope.charts.menu_chart){
        $scope.charts.menu_chart = {};
        $scope.charts.menu_chart.svg = d3.select("#menu_chart")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .attr("class", "menu_chart");

        $scope.charts.menu_chart.items_group = $scope.charts.menu_chart.svg.append('g').classed('items-container',true);
        $scope.charts.menu_chart.labels_group = $scope.charts.menu_chart.svg.append('g').classed('labels-container',true);
      }

      function updateSvgSize(){

        $scope.charts.menu_chart.svg
          .transition()
          .duration(delay)
          .attr("width", w)
          .attr("height", h);

        //send update to frame
        

      }

      function positionHome(){
        w = $(window).width();
        smallDevice = (w<768);

        wLabel = 0;

        var rows = sortItems($scope.charts.menu_chart.items_group.selectAll("g.compromiso-item"),0);

        h = rows*itemSize;

        updateSvgSize();

        updateLabels([]);

      }

      function sortItems($items,startingY,labels){

        startingY += (smallDevice && labels)?itemSize:0;

        wLabel = (smallDevice)?0:wLabel;

        var xLimit = Math.floor((w-wLabel)/itemSize),
            xCount = 0,
            yCount = 0,
            xOffset = ((w-wLabel)-(xLimit*itemSize))/2;

        $items
          .transition()
          .duration(delay)
          .attr("transform", function(d,i) {
            var x = xCount*itemSize+xOffset+wLabel;
            var y = yCount*itemSize+startingY;
            if(xCount<xLimit-1){
              xCount++;

            } else if($items[0].length!==i+1) {
              xCount = 0;
              yCount++;
            }
            return "translate(" + x +"," + y + ")";
          });

        return yCount+1+((smallDevice && labels)?1:0);
      }

      function groupByState(){

        w = $(window).width();
        smallDevice = (w<768);
        var rows = 0;
        wLabel = w/3;
        var labels = [];

        angular.forEach($scope.finishedPercentageGroup, function(group){
          labels.push({title:groups[group.key].from+'% - '+groups[group.key].to+'%',rows:rows});
          rows += sortItems($scope.charts.menu_chart.items_group.selectAll("g.avance-"+group.key),rows*itemSize,true);
        });

        h = rows*itemSize;

        updateSvgSize();
        updateLabels(labels);

      }

      function groupByCategory(){

        w = $(window).width();
        smallDevice = (w<768);
        var rows = 0;
        wLabel = w/3;
        var labels = [];

        angular.forEach($scope.categoriesGroupText, function(group){
          labels.push({title:group.key,rows:rows});
          rows += sortItems($scope.charts.menu_chart.items_group.selectAll("g.categoria-"+SlugColorService.getCategorySlug(group.key)),rows*itemSize,true);
        });

        h = rows*itemSize;

        updateSvgSize();
        updateLabels(labels);

      }

      function groupByDate(){

        w = $(window).width();
        smallDevice = (w<768);
        var rows = 0;
        wLabel = w/3;
        var labels = [];
        angular.forEach($scope.finishedYearsGroup, function(group){
          labels.push({title:group.key,rows:rows});
          rows += sortItems($scope.charts.menu_chart.items_group.selectAll("g.cumplimiento-"+group.key),rows*itemSize,true);
        });

        h = rows*itemSize;

        updateSvgSize();
        updateLabels(labels);

      }

      function updateLabels(data){

        $scope.charts.menu_chart.labels_group.selectAll("*").remove();

        var texts = $scope.charts.menu_chart.labels_group
          .selectAll('.label-group')
          .data(data);

        texts
          .enter()
          .append('g')
          .classed('label-group',true)
          .each(function(d){
              var group = d3.select(this);

              //frame
              group
                .append('rect')
                .classed('label-group-shape',true)
                .classed('shape',true)
                .attr('height',itemSize)
                .attr('width',(smallDevice)?w:w/3)
                .attr('fill','none');

              group
                .append('text')
                .classed('label-group-text',true)
                .classed('wrap',true)
//                .attr('x',gap)
//                .attr('y',itemSize/4)
                .attr('text-anchor','start')
                .attr('opacity',1)
                .text(function(d){
                  return d.title;
                });

              group
                .attr("transform",function(){
                  return "translate("+0+','+d.rows*itemSize+")";
                });

              var t = group.select("text");
              d3plus.textwrap()
                .container(t)
                .shape('square')
                .align('left')
                .valign('middle')
                .padding(3)
                .draw();

          });

      }

      function createCompromisos( ){

        var defaults = {
          "width": itemSize,
          "height": itemSize/3,
        };

        d3plus.textwrap()
          .config(defaults);

        $scope.charts.menu_chart.items_group
          .selectAll("g.compromiso-item")
          .data(data)
          .enter()
          .append('g')
          .attr("class", function(d) {
            var classes = [];
            classes.push('cumplimiento-'+d.cumplimiento1);
            classes.push('categoria-'+d.slug);
            classes.push('categoria-unselected');
            classes.push('avance-'+getPercentageGroup(d));
            return classes.join(' ');
          })
          .classed('compromiso-item',true)
          .attr('id',function(d){
            return 'c'+d.numero;
          })
          .each(function(d) {

              var group = d3.select(this);

              //frame
              group
                .append('rect')
                .classed('compromiso-frame',true)
                .attr('x',0)
                .attr('y',0)
                .attr('height',itemSize)
                .attr('width',itemSize)
                .attr('fill','white');

              //text
              group
                .append('rect')
                .classed('compromiso-label-shape',true)
                .classed('shape',true)
                .attr('x',gap)
                .attr('y',itemSize/2)
                .attr('height',(itemSize/2)-gap)
                .attr('width',itemSize-gap*2)
                .attr('fill','none');

              group
                .append('text')
                .classed('compromiso-label',true)
                .classed('wrap',true)
                .attr('id','c'+d.numero+'-text')
                .attr('opacity',0)
                .text(function(){
                  return d.titulo;
                });

              //load image
              group
                .append("g")
                .classed('compromiso-icon',true)
                .attr('id',function(d){
                  return 'c'+d.numero+'-icon';
                })
                .attr("transform", function() {
                    var x = itemSize/2-25;
                    var y = itemSize/3-25;
                    return "translate(" + x +"," + y + ")"; 
                })
                .each(function(d){
    
                  var iconG = this;
                  LoadSVGService.loadIcon(d.icono,function(iconLoaded){
                    $(iconLoaded)
                        .attr('width', 50)
                        .attr('height', 50)
                        .get(0);
                    iconG.appendChild(iconLoaded.cloneNode(true));
                  });

                });


              //rect frame
              group
                .append('rect')
                .classed('compromiso-action',true)
                .attr('x',gap)
                .attr('y',gap)
                .attr('height',itemSize-gap*2)
                .attr('width',itemSize-gap*2)
                .attr('fill','transparent')
                .on("mouseover",function(dd){
                  hoverTitle(dd.slug);
                  hoverCompromisoItem(dd.numero);
                })
                .on("mouseout",function(){
                  unhoverTitle();
                  unhoverCompromisoItem();
                  var $sel = $('.c-option-selected');
                  if($sel.size()){
                    selectCompromisoItem($sel.data('slug'));
                  }
                })
                .on("click", function(){
                  showDetail(d,d3.mouse(this),d3.event);
                });

          })
          .transition()
          .duration(0)
          .attr("transform", function() {
              var x = w/2-itemSize/2;
              var y = h/2-itemSize/2;
              return "translate(" + x +"," + y + ")"; 
          })
          .each("end", function(d){
            var t = d3.select('text#c'+d.numero+'-text');
            d3plus.textwrap()
              .container(t)
              .shape('square')
              .align('center')
              .valign('top')
              .padding(3)
              .draw();

            t.transition().attr('opacity',1);
          });

        }

        function init(){
          //start
          createCompromisos();

          $scope.charts.menu_chart.api = {
            group: function(group){
              switch(group){
                case 'home':
                  positionHome();
                break;
                case 'date':
                  groupByDate();
                break;
                case 'category':
                  groupByCategory();
                break;
                case 'state':
                  groupByState();
                break;
              }
            }
          };

          setTimeout(function(){
            $scope.charts.menu_chart.api.group($scope.selectedGroup);
          },1000);
          
        }

        //render menu chart
        init();

    }

    //General responsive callback
    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){ 
          if($scope.charts.menu_chart){
            $scope.charts.menu_chart.api.group($scope.selectedGroup);
          }
          if($scope.charts.category_chart){
            renderCategoryChart();
          }
          
        }, 500);
    });

    //events
    function hoverCompromisoItem(id){
      $('.compromiso-item').addClass('categoria-unselected');
      $('.compromiso-item#c'+id).removeClass('categoria-unselected');
    }

    function unhoverCompromisoItem(){
      $('.compromiso-item').addClass('categoria-unselected');
    }

    function selectCompromisoItem(slug){
      $('.compromiso-item').addClass('categoria-unselected');
      $('.compromiso-item.categoria-'+slug).removeClass('categoria-unselected');
    }

    function hoverTitle(slug){
      $('.c-option').removeClass('c-option-hover');
      $('.c-option[data-slug="'+slug+'"]').addClass('c-option-hover');
    }

    function unhoverTitle(){
      $('.c-option').removeClass('c-option-hover');
    }

    function selectTitle(slug){
      $('.c-option').removeClass('c-option-selected');
      $('.c-option[data-slug="'+slug+'"]').addClass('c-option-selected');
    }

    function deselectTitle(){
      $('.c-option').removeClass('c-option-selected');
    }

    function bindEvents(){
      // Hover title
      $('.c-option')
      .mouseover(function(){
        var slug = $(this).data('slug');
        if(slug){
          hoverTitle(slug);
          selectCompromisoItem(slug);
          selectCategoryChart(slug);
        }
      })
      .mouseout(function(){
        var slug = $(this).data('slug');
        if(slug){
          var $sel = $('.c-option-selected');
          if($sel.size()){
            selectCompromisoItem($sel.data('slug'));
            selectCategoryChart($sel.data('slug'));
          }else{
            unhoverCompromisoItem();
            defaultChartColors();
          }
          unhoverTitle();
        }
      })
      .click(function(){
        var slug = $(this).data('slug');
        if(slug){
          if($(this).hasClass('c-option-selected')){
            deselectTitle();
            defaultChartColors();
          } else {
            selectTitle(slug);
            selectCompromisoItem(slug);
            selectCategoryChart(slug);
            $scope.$apply(function(){
              $scope.selectedCategory = slug;
            });
          }
        }
      });
    }


  });
