'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function ($scope,$timeout,$document,$http,UrlService,GetSVGNameService, SlugColorService,LoadSVGService) {

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
        c.slug = c.slug.trim();
        c.categoria = c.categoria.trim();
        c.iconSVG = GetSVGNameService.getUrl(c.numero);
        return c;
      });
      $scope.data = $scope.data.sort(function(a,b){
        var upA = a.titulo.toUpperCase();
        var upB = b.titulo.toUpperCase();
        return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
      });


      console.log($scope.data);
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
          .key(function(d) { return d.cumplimiento; })
          .rollup(function(leaves) { return leaves.length; })
          .entries(g.values);
      });

      $scope.finishedYearsGroup = d3.nest()
        .key(function(d) { return d.cumplimiento; })
        .entries($scope.data);

      angular.forEach($scope.finishedYearsGroup, function(g){
         g.categoryGroup = d3.nest()
          .key(function(d) { return d.slug; })
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

    groups.push({from:100,to:75});
    groups.push({from:75,to:50});
    groups.push({from:50,to:25});
    groups.push({from:25,to:0});

    function getPercentageGroup(d){
      var group = 3;
      for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        var p = parseInt(d.porcentaje_completado);
        if (p <= g.from &&  p > g.to){
          group= i;
          break;
        }
      }
      d.percentageGroup = group;
      return group;
    }

    $scope.renderCharts = function(){

      // bindEvents();
      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();


    };


    function showDetail(c,localEvent,mouseEvent){

      var menu_chartRowSize = 150;
      $scope.$apply(function(){
        $scope.currentCompromise = c;
      });

      var popupH = parseInt( d3.select('#compromiso-detail').style('height').replace('px','') );
      var fillerH = parseInt( d3.select('#filler').style('height').replace('px','') );

      var docH = parseInt( $(window).height() );
      var yOffset = parseInt ( mouseEvent.clientY );
      var eTop = $('#menu_chart').offset().top; //get the offset top of the element
      var finalTop = eTop - $(window).scrollTop(); //position of the ele w.r.t window
      var mouseOffset = Math.floor((mouseEvent.clientY-eTop) / menu_chartRowSize) * menu_chartRowSize;

      //console.log(eTop, mouseEvent.clientY, mouseOffset);
      var pos = mouseOffset + eTop + 145;
      d3.select('#compromiso-detail')
        .style('top',pos+'px');


      $scope.$apply(function(){
        var someElement = angular.element(document.getElementById('compromiso-detail'));
        if(filler>0){
          d3.select('#filler').style('height',filler+'px');
        }
        else {
         d3.select('#filler').style('height',0+'px');
        }
          $document.scrollToElement(someElement, 500, 500);
         var filler = pos + popupH - docH + fillerH;

      });

    }

    $scope.redirectParent = function(url){
      $scope.pymChild.navigateParentTo(url);
    };

    $scope.closeDetail = function(){
       //Agregamos opacity animation
      d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');


      deselectTitle();
      defaultChartColors();
      $scope.currentCompromise = null;
      d3.select('#filler').style('height','0px');

      $scope.selectedCategory = '';
    };

    function renderDateChart(){


    }

    function renderStateChart(){
          //Get Years
          var mainColumns= ['x', '75-100%','50-75%','25-50%','0-25%'];

    }

    function defaultChartColors(){
      changeChartColors(SlugColorService.getColorBySlug());
    }

    function changeChartColors(colors){
      $scope.charts.state_chart.data.colors(colors);
      $scope.charts.date_chart.data.colors(colors);

      angular.forEach(colors,function(e,k){
        d3.selectAll('.leaf.'+k+' circle').style('fill',e);
      });
    }

    function selectCategoryChart(slug){
      var colors = {
        'social':"#e6e6e6",
        'disfrute':"#e6e6e6",
        'creatividad':"#e6e6e6",
        'humana':"#e6e6e6"
      };
      colors[slug] = SlugColorService.getColorBySlug(slug);
      changeChartColors(colors);
    }

    function renderCategoryChart(){

    }

    //Render & interact menu chart
    $scope.onChangeCategory = function(){

    };
    $scope.onChangeGroup = function(){
      $scope.groupMenu($scope.selectedGroup);
    };
    $scope.groupMenu = function(type){
      if($scope.currentCompromise){
        $scope.closeDetail();
      }
      $scope.selectedGroup = type;
      $scope.charts.menu_chart.api.group($scope.selectedGroup);
    };
    function renderMenuChart(){


      }

      function groupByCategory(){



      }

      function groupByDate(){



      }

      function updateLabels(data){



      }

    function createCompromisos( ){





    }




  });
