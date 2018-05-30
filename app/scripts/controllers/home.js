'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('HomeCtrl', function($scope, $timeout, $document, $http, $filter, UrlService, GetSVGNameService, SlugColorService, LoadSVGService, $sce) {

    $scope.pymChild = new pym.Child({
      polling: 1000
    });
    $scope.pymChild.sendHeight();

    $scope.data = [];
    $scope.loading = true;
    $scope.charts = {};
    $scope.puntos =[];
    $scope.selectedGroup = 'home';

    $scope.mapActive = false;
    $scope.iconsActive = true;
    $scope.mapReady = false;

    $scope.getCompromiso = function(numero){
      var findC ={};
      for (var i = 0; i < $scope.data.length; i++) {
        var c = $scope.data[i];
        if (c.numero === numero){
          findC = c;
           break;
        }
       

      };
      return findC;
    };


    $scope.mostrarMapa = function(){
      if (!$scope.mapReady){
        $scope.usigLayers.startUsig();
        $scope.mapReady = true;
      }
      refreshGrid();
      $scope.closeDetail();
      $scope.iconsActive = false;
      $scope.mapActive = true;
    };
    $scope.mostrarIconos = function(){
    
      $scope.iconsActive = true;
      $scope.mapActive = false;
      $scope.closeDetail();
      $timeout(function(){
         refreshGrid();
       },300)
    };
    var compromisosURL = UrlService.getUrlByPage('home');
    var obrasURL = UrlService.getUrlByPage('obras');

    $http.jsonp(compromisosURL)
      .success(function(data) {
        $scope.data = data.map(function(c) {
          c.slug = c.slug.trim();
          c.categoria = c.categoria.trim();
          c.iconSVG = GetSVGNameService.getUrl(c.numero);
          try{
           c.comunas = c.comunas.split(',');
           c.claseComunas = "";
           for (var i = 0; i < c.comunas.length; i++) {
             c.claseComunas += "com-" +c.comunas[i] + " ";
           }
          }
          catch(e){
            console.log('error en comunas compromiso' + c.numero);
          }
          return c;
        });
        $scope.data = $scope.data.sort(function(a, b) {
          var upA = a.titulo.toUpperCase();
          var upB = b.titulo.toUpperCase();
          return (upA < upB) ? -1 : (upA > upB) ? 1 : 0;
        });
        var areas = []
        var cumplimiento = [];
        var comunas = [];
        comunas.push({
            name: "(Todas las comunas)",
            number: 0,
            selected:true,
          });

        for (var i = 1; i <= 15; i++) {
          comunas.push({
            name: "Comuna "+ i,
            number: i,
            selected: false
          });     
        }
        $scope.data.map(function(elem) {
          if (elem.porcentaje_completado <= 25) elem.classPercent = "very-low"
          if ((elem.porcentaje_completado > 25) && (elem.porcentaje_completado <= 50)) elem.classPercent = "low"
          if ((elem.porcentaje_completado > 50) && (elem.porcentaje_completado <= 75)) elem.classPercent = "high"
          if (elem.porcentaje_completado > 75) elem.classPercent = "very-high"

          if (elem.cumplimiento != undefined) cumplimiento.push(elem.cumplimiento)

          if (elem.area1 != undefined) areas.push(elem.area1.toLowerCase().replace(/ /g, "-"))
          if (elem.area2 != undefined) areas.push(elem.area2.toLowerCase().replace(/ /g, "-"))
          if (elem.area3 != undefined) areas.push(elem.area3.toLowerCase().replace(/ /g, "-"))
          if (elem.area4 != undefined) areas.push(elem.area4.toLowerCase().replace(/ /g, "-"))
        });
        $scope.areas = Array.from(new Set(areas))
        $scope.cumplimiento = Array.from(new Set(cumplimiento))
        $scope.comunas = comunas;
        $scope.selectedComuna = comunas[0];
        $scope.loading = false;
        // $scope.executeIsotope()
        $scope.groupData();
        $scope.renderCharts();
        $scope.usigMaps($)
      });

    $scope.groupData = function() {
      $scope.categoriesGroup = d3.nest()
        .key(function(d) {
          return d.slug;
        })
        .entries($scope.data);

      $scope.categoriesGroupText = d3.nest()
        .key(function(d) {
          return d.categoria;
        })
        .entries($scope.data);

      $scope.availableCategories = [];
      angular.forEach($scope.categoriesGroup, function(g) {
        $scope.availableCategories.push(g.key);
      });
      angular.forEach($scope.categoriesGroup, function(g) {

        g.finishedYearsGroup = d3.nest()
          .key(function(d) {
            return d.cumplimiento;
          })
          .rollup(function(leaves) {
            return leaves.length;
          })
          .entries(g.values);
      });

      $scope.finishedYearsGroup = d3.nest()
        .key(function(d) {
          return d.cumplimiento;
        })
        .entries($scope.data);

      angular.forEach($scope.finishedYearsGroup, function(g) {
        g.categoryGroup = d3.nest()
          .key(function(d) {
            return d.slug;
          })
          .rollup(function(leaves) {
            return leaves.length;
          })
          .entries(g.values);
      });
      $scope.availableYears = [];
      angular.forEach($scope.finishedYearsGroup, function(g) {
        $scope.availableYears.push(g.key);
      });
      $scope.availableYears = $scope.availableYears.sort();

      $scope.finishedPercentageGroup = d3.nest()
        .key(function(d) {
          return getPercentageGroup(d);
        })
        .entries($scope.data);

      

    };

    var groups = [];

    groups.push({
      from: 100,
      to: 75
    });
    groups.push({
      from: 75,
      to: 50
    });
    groups.push({
      from: 50,
      to: 25
    });
    groups.push({
      from: 25,
      to: 0
    });

    function getPercentageGroup(d) {
      var group = 3;
      for (var i = 0; i < groups.length; i++) {
        var g = groups[i];
        var p = parseInt(d.porcentaje_completado);
        if (p <= g.from && p > g.to) {
          group = i;
          break;
        }
      }
      d.percentageGroup = group;
      return group;
    }

    $scope.showCompromisoDetail = function(d, $event) {
      
     $scope.selectedCategory = d.slug;

      if ($scope.currentCompromise && ($scope.currentCompromise.numero == d.numero)) {

        $scope.closeDetail();

      } else {
        showDetail(d, $event, d3.event);
      }
    };

    $scope.renderCharts = function() {

      // bindEvents();
      renderDateChart();
      renderStateChart();
      renderCategoryChart();
      renderMenuChart();



    };

    function showDetail(c, localEvent, mouseEvent) {

      var menu_chartRowSize = 150;
      $scope.currentCompromise = c;


      var popupH = parseInt(d3.select('#compromiso-detail').style('height').replace('px', ''));
      var fillerH = parseInt(d3.select('#filler').style('height').replace('px', ''));

      var docH = parseInt($(window).height());
      var yOffset = parseInt(localEvent.clientY);
      var eTop = $('#form-ui').offset().top; //get the offset top of the element
      var finalTop = eTop - $(window).scrollTop(); //position of the ele w.r.t window
      var mouseOffset = Math.floor((localEvent.clientY - eTop) / menu_chartRowSize) * menu_chartRowSize;

      var pos = mouseOffset + eTop + 150;
      d3.select('#compromiso-detail')
        .transition()
        .style('top', pos + 'px');



      var someElement = angular.element(document.getElementById('compromiso-detail'));
      var filler = pos + popupH - docH + fillerH;
      if (filler > 0) {
        d3.select('#filler').style('height', filler + 'px');
      } else {
        d3.select('#filler').style('height', 0 + 'px');
      }




    }

    $scope.redirectParent = function(url) {
      $scope.pymChild.navigateParentTo(url);
    };
    $scope.forceCloseDetail = function() {
      if (!window.mobileAndTabletcheck()) {
        $scope.closeDetail();
      }
    }
    $scope.closeDetail = function() {
      //Agregamos opacity animation
      // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');


      // deselectTitle();
      // defaultChartColors();
      if ($scope.currentCompromise) {

        $scope.currentCompromise = null;
        d3.select('#filler').style('height', '0px');

        $scope.selectedCategory = '';
      }

    };

      $scope.closeObraDetail = function() {
      //Agregamos opacity animation
      // d3.selectAll('.menu_chart rect').transition().style('fill','rgba(255, 255, 255, 0)');


      // deselectTitle();
      // defaultChartColors();
      if ($scope.currentObra) {

        $scope.currentObra = null;
      }

    };

    
    function renderDateChart() {


    }

    function renderStateChart() {
      //Get Years
      var mainColumns = ['x', '75-100%', '50-75%', '25-50%', '0-25%'];

    }

    function defaultChartColors() {
      changeChartColors(SlugColorService.getColorBySlug());
    }

    function changeChartColors(colors) {
      $scope.charts.state_chart.data.colors(colors);
      $scope.charts.date_chart.data.colors(colors);

      angular.forEach(colors, function(e, k) {
        d3.selectAll('.leaf.' + k + ' circle').style('fill', e);
      });
    }

    function selectCategoryChart(slug) {
      var colors = {
        'social': "#e6e6e6",
        'disfrute': "#e6e6e6",
        'creatividad': "#e6e6e6",
        'humana': "#e6e6e6"
      };
      colors[slug] = SlugColorService.getColorBySlug(slug);
      changeChartColors(colors);
    }

    function renderCategoryChart() {

    }

    //Render & interact menu chart
    $scope.onChangeCategory = function() {

    };
    $scope.onChangeGroup = function() {
      $scope.groupMenu($scope.selectedGroup);
    };
    $scope.groupMenu = function(type) {
      if ($scope.currentCompromise) {
        $scope.closeDetail();
      }
      $scope.selectedGroup = type;
      $scope.charts.menu_chart.api.group($scope.selectedGroup);
    };

    function renderMenuChart() {


    }

    function groupByCategory() {



    }

    function groupByDate() {



    }

    function updateLabels(data) {



    }

    function createCompromisos() {

    }

    var refreshGrid = function() {
      // map input values to an array
      var exclusives = [];
      var inclusives = [];



      var ww = $('#searchTextInput').val().toLowerCase().split(' ');





      // exclusive filters from selects
      $selects.each(function(i, elem) {
        if (elem.value) {
          exclusives.push(elem.value);
        }
      });
      // inclusive filters from checkboxes
      $years.each(function(i, elem) {
        // if checkbox, use value if checked
        if (elem.checked) {
          exclusives.push(elem.value);
        }
      });
      $percent.each(function(i, elem) {
        // if checkbox, use value if checked
        if (elem.checked) {
          exclusives.push(elem.value);
        }
      });
      // inclusive filters from checkboxes
      $checkboxes.each(function(i, elem) {
        // if checkbox, use value if checked
        if (elem.checked) {
          inclusives.push(elem.value);
        }
      });
      if ($scope.selectedComuna != 0){
        exclusives.push('.com-' + $scope.selectedComuna);
      }
      // combine exclusive and inclusive filters

      // first combine exclusives
      exclusives = exclusives.join('');
      var filterValue;
      if (inclusives.length) {
        // map inclusives with exclusives for
        filterValue = $.map(inclusives, function(value) {
          return value + exclusives;
        });
        filterValue = filterValue.join(', ');
      } else {
        filterValue = exclusives;
      }

      //Filter Grid.
      $container.isotope({
        filter: function() {
          var $this = $(this);
          var searchResult = true;
          for (var i = 0; i < ww.length; i++) {
            searchResult = $this.text().toLowerCase().indexOf(ww) > -1;
          }
          var buttonResult = filterValue ? $this.is(filterValue) : true;
          return searchResult && buttonResult;
        }
      });
      //Filter Map.
      var filtered = $container.isotope('getFilteredItemElements')
      var currentCompromisos = filtered.map(function(e){return parseInt(e.attributes.compromiso.value);});
      
        $scope.puntos.map(function(p){
          var showMe = false;
          for (var j = 0; j < currentCompromisos.length; j++) {
            var cId = currentCompromisos[j] + '';
           
            if (p.numero === cId){
              p.visible = true;
              showMe = true;
              break;
            }
          }
          if (showMe){
            p.layer.addFeatures(p.obras);
          }
          else {
            p.layer.removeFeatures(p.obras);
          }
      });
      
          


    };
    $scope.setTextFilter = function() {
      refreshGrid();
    }

    $scope.setAllFilters = function() {
      $('.checkMyCheck').each(function() {
        $(this).parent().removeClass('inactive');
        $(this).parent().addClass('active');
        $(this).prop('checked', true);
      })
      $years.add($percent).each(function() {
        $(this).prop('checked', false);
      });
      refreshGrid();
      $scope.closeDetail();
    };
    $scope.removeAllFilters = function() {
      $('#searchTextInput').val('');
      $('.checkMyCheck').each(function() {
        $(this).parent().removeClass('active');
        $(this).parent().addClass('inactive');
        $(this).prop('checked', false);
      })
      $years.add($percent).each(function() {
        $(this).prop('checked', false);
      });
      refreshGrid();
      $scope.closeDetail();
    };
    $scope.changeComunas = function(){
        refreshGrid();
        $scope.closeDetail();
        
      };
    var $container, $output, $selects, $checkboxes, $years, $percent;

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
      $container = $('#isotopeContainer').isotope({
        itemSelector: '.item'
      });

      $output = $('#output');
      // filter with selects and checkboxes
      $selects = $('#form-ui select.me');

      $checkboxes = $('.homeAreaContainer .categories');
      $years = $('#homeYearContainer .years');
      $percent = $('#homePercentContainer .percent');
      
      $years.add($checkboxes).add($percent).change(function() {
        refreshGrid();
        $scope.$apply(function() {
          $scope.closeDetail();
        });
      });
      
       $('.checkMyCheck').change(function() {

       });
      $('.checkMyCheck').change(function() {
        if ($(this).parent().hasClass('active')) {
          $(this).parent().addClass('inactive');
          $(this).parent().removeClass('active');
        } else {
          $(this).parent().addClass('active');
          $(this).parent().removeClass('inactive');

        }

      });

      var ac = new usig.AutoCompleter('search', {
            skin: 'usig2',
            onReady: function() {
              $('#search').val('').removeAttr('disabled').focus();
            },
            afterSelection: function(option) {
              if (option instanceof usig.Direccion || option instanceof usig.inventario.Objeto) {
                selectedOption = option;
              }
            },
            afterGeoCoding: function(pt) {
              if (pt instanceof usig.Punto) {
                mapa.goTo(pt, true);
              }             
            }
          });
    });

    




////////////////////////////////////////////////////////////////////////////////
////////////////////// MARKERS METHOD //////////////////////////////////////////

    var miMapa;
    var selectedOption = "";
    var vector = []
    var actividades = $("input[name=actividades]")

    $scope.usig = {
      removeMarkers: function() {
        
        vector.map(function(elem) {
          mapa.removeMarker(elem)
        })
      },
      addMarkers: function() {
        $scope.usig.removeMarkers()
        var sValue = "";
        var iconSize = new OpenLayers.Size(41, 41)
        var iconUrl = "images/punto.png";
        actividades.each(function() {
          if ($(this).is(':checked')) {
            sValue = parseInt($(this).val())
            $scope.usigCompromiso.features.map(function(elem) {
              // if (elem.properties.compromiso === sValue) {
                  var customMarker = new OpenLayers.Marker(new OpenLayers.LonLat(elem.properties.longitude,elem.properties.latitude),new OpenLayers.Icon(iconUrl, iconSize));
                  var markerId = mapa.addMarker(customMarker, true, "<img src="+iconUrl+" style='max-width:150px'><br><p>"+elem.properties.compromiso+"</p>");
                  vector.push(markerId)
              // }
            })
          } else {
            
          }


        });
      }
    }

////////////////////////////////////////////////////////////////////////////////
////////////////////// MARKERS METHOD ACTIVE////////////////////////////////////
  //  $scope.usig.createMap()

////////////////////////////////////////////////////////////////////////////////
////////////////////// LAYERS METHOD ///////////////////////////////////////////
// Definicion del namespace
var mapa = null, layers = [];

$scope.usigLayers = {
  redimensionarMapa : function(){
    
      $('#mapa').css('width', $(window).width()).css('height', $(window).height()).css('margin', 0);
      if (mapa) {
          $('.olControlPanZoomBarUSIG').hide();
          mapa.updateSize();
      }
  },
  reposicionarControles: function(){
    
      $('.olControlPanZoomBarUSIG').css('left', 'auto').css('top', 'auto').css('right', '15px').css('bottom', '15px').show();
      $('#panel-informacion').css('height', $(window).height() - 30);
  },
  crearPanelInfo: function(){
    
      // Panel de informacion
      $('#mapa').append($('#template-panel-informacion').html());
  },
  
  removeLayers : function(){
    
  },
  cargarLayers : function(){
    
      $scope.loading = true;
      $scope.markers = [];
       var iconSize = new OpenLayers.Size(15, 16)
       var iconUrl = "images/punto.png"
       $scope.puntos = [];

        $http
          .jsonp(obrasURL)
          .success(function(csv){ console.log('data');

          $scope.usigCompromiso = csv;
          $scope.usigCompromiso.map(function(elem) {

                  var destProj = new proj4.Proj("EPSG:221951");
                  var sourceProj= new proj4.Proj("EPSG:4326");
                  elem.proj =  proj4(sourceProj,destProj,[elem.longitude, elem.latitude]);


                  var lonLat = new OpenLayers.LonLat(elem.proj[0], elem.proj[1]);
                  var point = new OpenLayers.Geometry.Point(elem.proj[0], elem.proj[1]);

                    var currentMarker = new OpenLayers.Feature.Vector(point, null, {
                        externalGraphic: "images/punto.png",        graphicWidth: 16,
                        graphicHeight: 16,
                        fillOpacity: 0.8
                    });
                  
                  if (!$scope.puntos[elem.numero]){
                    $scope.puntos[elem.numero] = {
                      numero: elem.numero,
                      layer:  mapa.addVectorLayer(elem.numero, { 
                          symbolizer: {
                            externalGraphic: 'images/punto.png',
                            graphicWidth: 10,
                            graphicHeight: 18,
                            graphicXOffset: -4,
                            graphicYOffset: -34,
                            graphicZIndex: 10,
                            backgroundGraphicZIndex: 9
                          },
                          popup: false,
                          onClick: function(ev, marker) {
                             var $scope = angular.element(document.getElementById('compromisos-main')).scope();
                             $scope.$apply(function(){
                              $scope.currentObra = ev.feature.geometry.marker;
                              $scope.currentObra.compromisoDetail = $scope.getCompromiso($scope.currentObra.numero);
                             });
                            }
                          }),
                      obras: []
                    };
                  }
                  point.marker = elem;
                  $scope.puntos[elem.numero].obras.push(currentMarker);
                  $scope.markers.push(currentMarker);

                });

        refreshGrid();
         // mapa.zoomToMarkers();
        $scope.loading = false;


    });       
        

  },
  stopPropagation : function (ev) {
    
      if (ev.stopPropagation) {
          ev.stopPropagation();
      } else {
          ev.cancelBubble = true;
      }
  },
  inicializar : function () {
      $scope.usigLayers.cargarLayers();
  },
  startUsig : function () {
    
          // Elimino el "Cargando..."
          $('#mapa').empty();

          // El div del mapa tiene que ocupar toda la ventana
          // $scope.usigLayers.redimensionarMapa();
          $('#mapa').css('width', '100wh').css('height', '60vh');

          var mapOptions = {
            divId: 'mapa',
              zoomBar: false,
              baseLayer: usig.App.config.baseLayer,
              initBounds: usig.App.config.initBounds,
              onReady: function() {
                $scope.usigLayers.inicializar(); // Esto es para que funcione en IE 10
              }
          };
          mapa = new usig.MapaInteractivo(mapOptions.divId, mapOptions);
          window.mapa = mapa;

  }
}



////////////////////////////////////////////////////////////////////////////////
/////////////////////////LAYERS METHOD ACTIVE///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    $scope.usigMaps = function($) {

      

    }





  })
  .filter('trustAsResourceUrl', ['$sce', function($sce) {
    return function(val) {
      return $sce.trustAsResourceUrl(val);
    };
  }])
  .directive('onFinishRender', function($timeout) {
    return {
      restrict: 'A',
      link: function(scope, element, attr) {
        if (scope.$last === true) {
          $timeout(function() {
            scope.$emit(attr.onFinishRender);
          });
        }
      }
    }
  });
