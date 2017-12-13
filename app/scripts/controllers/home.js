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

                  // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');
                  // // //Agregamos opacity animation
                  // // d3.selectAll('.menu_chart g.categoria-unselected rect').transition().style('fill','rgba(255, 255, 255, 0.83)');


                  // // selectTitle(d.slug);
                  // // selectCategoryChart(d.slug);
                  // // hoverCompromisoItem(d.numero);

                      $scope.selectedCategory = d.slug;

                  // if($scope.currentCompromise && ($scope.currentCompromise.numero == d.numero) ){

                  //     $scope.closeDetail();

                  // } else {
                    showDetail(d,$event,d3.event);
                  // }
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
      var pos = mouseOffset + eTop + 150;
      d3.select('#compromiso-detail')
        .transition()
        .style('top',pos+'px');



        var someElement = angular.element(document.getElementById('compromiso-detail'));
        if(filler>0){
          d3.select('#filler').style('height',filler+'px');
        }
        else {
         d3.select('#filler').style('height',0+'px');
        }
         var filler = pos + popupH - docH + fillerH;



    }

    $scope.redirectParent = function(url){
      $scope.pymChild.navigateParentTo(url);
    };

    $scope.closeDetail = function(){
       //Agregamos opacity animation
      // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');


      // deselectTitle();
      // defaultChartColors();
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
    // $scope.executeIsotope2 = function(){
    //   console.log("executeIsotope");
    //   $(function(){
    //
    //   var $container = $('#isotopeHomeContainer'),
    //   $checkboxes = $('#filters input'),
    //   qsRegex;
    //
    //   $container.isotope({
    //   itemSelector: '.item',
    //   layoutMode: 'fitRows'
    //   });
    //
    //
    //   // get Isotope instance
    //   var isotope = $container.data('isotope');
    //
    //   // add even classes to every other visible item, in current order
    //   function addEvenClasses() {
    //     isotope.$filteredAtoms.each( function( i, elem ) {
    //     $(elem)[ ( i % 2 ? 'addClass' : 'removeClass' ) ]('even')
    //     });
    //   }
    //
    //
    //   $checkboxes.change(function(){
    //     var filters = [];
    //     // get checked checkboxes values
    //     $checkboxes.filter(':checked').each(function(){
    //     filters.push( this.value );
    //     });
    //
    //
    //     var searchResult = qsRegex ? $inputSearch.text().match( qsRegex ) : true;
    //
    //     filters = filters.join(', ');
    //     $container.isotope({ filter: filters, searchResult });
    //     addEvenClasses();
    //   });
    //
    //
    //
    //   $('#shuffle').click(function(){
    //   $container.isotope('shuffle');
    //   addEvenClasses();
    //   });
    //
    //   // debounce so filtering doesn't happen every millisecond
    //   function debounce( fn, threshold ) {
    //     var timeout;
    //     return function debounced() {
    //       if ( timeout ) {
    //         clearTimeout( timeout );
    //       }
    //       function delayed() {
    //         fn();
    //         timeout = null;
    //       }
    //       setTimeout( delayed, threshold || 100 );
    //     };
    //   }
    //
    //   });
    // }


    $scope.executeIsotope = function(){

    }
  })
  .directive('myRepeatDirective', function() {
  return function(scope, element, attrs) {
          console.log("executeIsotope");
          var $container = $('#isotopeContainer').isotope({
          itemSelector: '.item'
          });

          var $output = $('#output');

          // filter with selects and checkboxes
          var $selects = $('#form-ui select');
          var $checkboxes = $('#form-ui #categories');
          var $years = $('#form-ui #years');
          var $percent = $('#form-ui .percent');
          $years.add( $checkboxes ).add( $percent).change( function() {
          // map input values to an array
          var exclusives = [];
          var inclusives = [];
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
              inclusives.push( elem.value );
            }
          });
          $percent.each( function( i, elem ) {
            // if checkbox, use value if checked
            if ( elem.checked ) {
              inclusives.push( elem.value );
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

          $output.text( filterValue );
          $container.isotope({ filter: filterValue })
          });

          $('.checkboxCheck').change(function () {
                  if($(this).hasClass('ckecked'))
                  {
                    $(this).removeClass('checked');
                  }else{
                  $(this).addClass('checked')
                }

          });


  };
})

// $('.checkboxCheck').change(function () {
//   console.log("holaaaa");
//         $('label').next().removeClass('checked');
//         $(this).next().addClass('checked');
// });
