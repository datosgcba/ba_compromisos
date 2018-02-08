'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function ($scope,$timeout,$document,$http,UrlService,GetSVGNameService, SlugColorService,LoadSVGService,$sce) {

    $scope.pymChild = new pym.Child({ polling: 250 });
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
      var areas = []
      var cumplimiento = []
      $scope.data.map(function(elem){
        if(elem.porcentaje_completado <= 25) elem.classPercent = "very-low"
        if((elem.porcentaje_completado  >25)&&(elem.porcentaje_completado  <= 50)) elem.classPercent = "low"
        if((elem.porcentaje_completado  >50)&&(elem.porcentaje_completado  <= 75)) elem.classPercent = "high"
        if(elem.porcentaje_completado > 75) elem.classPercent = "very-high"

        if(elem.cumplimiento != undefined) cumplimiento.push(elem.cumplimiento)

        if(elem.area1 != undefined) areas.push(elem.area1.toLowerCase().replace(/ /g,"-"))
        if(elem.area2 != undefined) areas.push(elem.area2.toLowerCase().replace(/ /g,"-"))
        if(elem.area3 != undefined) areas.push(elem.area3.toLowerCase().replace(/ /g,"-"))
        if(elem.area4 != undefined) areas.push(elem.area4.toLowerCase().replace(/ /g,"-"))
      })
      $scope.areas = Array.from(new Set(areas))
      $scope.cumplimiento = Array.from(new Set(cumplimiento))
      console.log($scope.areas);
      console.log($scope.cumplimiento);



      console.log($scope.data);
      $scope.loading = false;
      // $scope.executeIsotope()
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

    $scope.showCompromisoDetail = function(d,$event){
      console.log("hola");
      console.log($event);

                  // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');
                  // // //Agregamos opacity animation
                  // // d3.selectAll('.menu_chart g.categoria-unselected rect').transition().style('fill','rgba(255, 255, 255, 0.83)');


                  // // selectTitle(d.slug);
                  // // selectCategoryChart(d.slug);
                  // // hoverCompromisoItem(d.numero);

                      $scope.selectedCategory = d.slug;

                 if($scope.currentCompromise && ($scope.currentCompromise.numero == d.numero) ){

                     $scope.closeDetail();

                 } else {
                    showDetail(d,$event,d3.event);
                 }
    };

    $scope.renderCharts = function(){

      // bindEvents();
      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();





    };

    function showDetail(c,localEvent,mouseEvent){
  
      var menu_chartRowSize = 150;
      $scope.currentCompromise = c;

      var popupH = parseInt( d3.select('#compromiso-detail').style('height').replace('px','') );
      var fillerH = parseInt( d3.select('#filler').style('height').replace('px','') );

      var docH = parseInt( $(window).height() );
      var yOffset = parseInt ( localEvent.clientY );
      var eTop = $('#form-ui').offset().top; //get the offset top of the element
      var finalTop = eTop - $(window).scrollTop(); //position of the ele w.r.t window
      var mouseOffset = Math.floor((localEvent.clientY-eTop) / menu_chartRowSize) * menu_chartRowSize;

      console.log(eTop, localEvent.clientY, mouseOffset);
      var pos = mouseOffset + eTop + menu_chartRowSize;
      d3.select('#compromiso-detail')
        .transition()
        .style('top',pos+'px');

      $timeout(function(){
        
        var popupH = $('#compromiso-detail').height();
        var fillerH =$('#filler').height();
        if (isNaN(popupH)){
          popupH = 0;
        }
        var filler = pos + popupH - docH + fillerH;
        if(filler>0){
          d3.select('#filler').style('height',filler+'px');
        }
        else {
         d3.select('#filler').style('height',0+'px');
        }

        $scope.pymChild.sendHeight();

      },250)
      


    }

    $scope.redirectParent = function(url){
      $scope.pymChild.navigateParentTo(url);
    };
    $scope.forceCloseDetail = function(){
      if (!window.mobileAndTabletcheck()){
        $scope.closeDetail();
      }
    }
    $scope.closeDetail = function(){
       //Agregamos opacity animation
      // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');


      // deselectTitle();
      // defaultChartColors();
      if ($scope.currentCompromise){

       $scope.currentCompromise = null;
       d3.select('#filler').style('height','0px');

      $scope.selectedCategory = '';
      }

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

    var refreshGrid = function(){
            // map input values to an array
            var exclusives = [];
            var inclusives = [];



            var ww = $('#searchTextInput').val().toLowerCase().split(' ');





            // exclusive filters from selects
            $selects.each( function( i, elem ) {
              if ( elem.value ) {
                exclusives.push( elem.value );
              }
            });
            // inclusive filters from checkboxes
            $years.each( function( i, elem ) {
              // if checkbox, use value if checked
              if ( elem.checked ) {
                exclusives.push( elem.value );
              }
            });
            $percent.each( function( i, elem ) {
               // if checkbox, use value if checked
              if ( elem.checked ) {
                exclusives.push( elem.value );
              }
            });
            // inclusive filters from checkboxes
            $checkboxes.each( function( i, elem ) {
              // if checkbox, use value if checked
              if ( elem.checked ) {
                inclusives.push( elem.value );
              }
            });

            // combine exclusive and inclusive filters

            // first combine exclusives
            exclusives = exclusives.join('');

            var filterValue;
            if ( inclusives.length ) {
              // map inclusives with exclusives for
              filterValue = $.map( inclusives, function( value ) {
                return value + exclusives;
              });
              filterValue = filterValue.join(', ');
            } else {
              filterValue = exclusives;
            }


            $container.isotope({ filter: function() {
              var $this = $(this);
              var searchResult = true;
              for (var i = 0; i < ww.length; i++) {
                searchResult = $this.text().toLowerCase().indexOf(ww) > -1;
              }
              var buttonResult = filterValue ? $this.is( filterValue ) : true;
              return searchResult && buttonResult;
            }
          })



    };
    $scope.setTextFilter = function(){
      refreshGrid();
    }

    $scope.setAllFilters = function(){
      $('.checkMyCheck').each(function(){
          $(this).parent().removeClass('inactive');
          $(this).parent().addClass('active');
          $(this).prop('checked', true);
      })
      $years.add( $percent).each(function(){
        $(this).prop('checked', false);
      });
      refreshGrid();
      $scope.closeDetail();
    };
    $scope.removeAllFilters = function(){
      $('#searchTextInput').val('');
      $('.checkMyCheck').each(function(){
          $(this).parent().removeClass('active');
          $(this).parent().addClass('inactive');
          $(this).prop('checked', false);
      })
      $years.add( $percent).each(function(){
        $(this).prop('checked', false);
      });
      refreshGrid();
      $scope.closeDetail();
    };
    var $container,$output, $selects ,$checkboxes,$years,$percent;

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
          $container = $('#isotopeContainer').isotope({
            itemSelector: '.item'
          });

           $output = $('#output');
          // filter with selects and checkboxes
           $selects = $('#form-ui select');

           $checkboxes = $('.homeAreaContainer .categories');
           $years = $('#homeYearContainer .years');
           $percent = $('#homePercentContainer .percent');
          $years.add( $checkboxes ).add( $percent).change(function(){
            refreshGrid();
            $scope.$apply(function(){
              $scope.closeDetail();
            });
          });

            $('.checkMyCheck').change(function () {
                    if($(this).parent().hasClass('active'))
                    {
                      $(this).parent().addClass('inactive');
                      $(this).parent().removeClass('active');
                    }
                    else{
                      $(this).parent().addClass('active');
                      $(this).parent().removeClass('inactive');

                  }

            });
      });

      // $scope.trustSrc = function(src) {
      //   console.log("trustAsResourceUrl");
      //   console.log($sce.trustAsResourceUrl(src));
      //   return $sce.trustAsResourceUrl(src);
      // }

  })
  .filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
        return $sce.trustAsResourceUrl(val);
    };
}])
  .directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit(attr.onFinishRender);
                });
            }
        }
    }
  });
