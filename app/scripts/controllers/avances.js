'use strict';

/**
 * @ngdoc function
 * @name compromisosSiteApp.controller:AvancesCtrl
 * @description
 * # AboutCtrl
 * Controller of the compromisosSiteApp
 */
angular.module('compromisosSiteApp')
  .controller('AvancesCtrl', function (UrlService, $rootScope, $routeParams, $scope, $http, GetSVGNameService, SlugColorService,LoadSVGService,$sce,$templateRequest,$compile, $location) {

    $scope.loading = true;

    var pymChild = new pym.Child({ polling: 1000 });
    pymChild.sendHeight();
    var _ = window._;

    $scope.dataCompromisos = [];
    $scope.dataAvances = [];
    $scope.dataObras = [];

    var homeUrl = UrlService.getUrlByPage('home');
    var obrasUrl = UrlService.getUrlByPage('obras');

    $http.jsonp(homeUrl)
      .success(function(dataCompromisos){
        //console.log(dataCompromisos)
          dataCompromisos.map(function(compromiso) {
            let pos = $scope.posInArray(compromiso.area1, $scope.dataAvances);
            if ( pos === - 1) {
              $scope.dataAvances.push({
                area: compromiso.area1,
                open: false,
                progress: 0,
                intro: $scope.getIntro(compromiso.area1),
                compromisos: [
                  compromiso
                ]
              });
            } else {
              $scope.dataAvances[pos].compromisos.push(compromiso);
            }
          });
          $scope.dataCompromisos = dataCompromisos;
          $scope.processCompromisos();
          $scope.mandato();

          //console.log($scope.dataAvances);

          $http.jsonp(obrasUrl)
            .success( function ( dataObras ) {
              //console.log(dataObras)
              $scope.dataObras = dataObras;
              $scope.processObras();
              $scope.loading = false;
            });

      });

    $scope.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    $scope.zonaNorte = [12,13,14,15];
    $scope.zonaSur = [4,8,9];
    $scope.zonaCentro = [11,10,6,7,5,3,2,1];
    $scope.textos = [
      { title: 'Transporte público seguro y de calidad', text: 'Nos comprometimos a mejorar la movilidad en la Ciudad, priorizando el transporte público, peatonal y el uso de la bicicleta. Con grandes obras de infraestructura y más tecnología estamos garantizando mayor previsibilidad y comodidad para que los vecinos puedan moverse de manera rápida, segura y sustentable.' },
      { title: 'Más espacio público y verde de calidad', text: 'Nos comprometimos a construir una Ciudad con más y mejor espacio público para que todos los vecinos puedan disfrutarlo. Seguimos sumando espacios verdes de calidad, seguros y cercanos a todos los vecinos.' },
      { title: 'Creatividad y Cultura', text: 'Queremos que la Ciudad siga desarrollando su potencial creativo y cultural. Por eso, nos comprometimos a potenciar nuevos conocimientos, herramientas tecnológicas, propuestas innovadoras y mayor acceso a espacios culturales.' },
      { title: 'Grandes obras públicas', text: 'Estamos transformando la Ciudad con grandes obras de infraestructura en todas las comunas, para mejorar la movilidad, el transporte, promover la inclusión social, e impulsar el desarrollo e integración de zonas históricamente relegadas.' },
      { title: 'Transformación educativa', text: 'Nos comprometimos a mejorar la calidad educativa, asegurar la equidad, y orientar la escuela hacia el futuro para que los chicos puedan desarrollar su máximo potencial. Seguimos sumando más horas de clase, tecnología, más infraestructura y capacitación para todos los docentes.' },
      { title: 'Seguridad', text: 'Nos comprometimos a que la Ciudad sea cada día más segura, con más policías en la calle, capacitados, bien equipados y cercanos a los vecinos. Incorporamos tecnología de última generación que nos permite una integración inteligente y profesional para seguir mejorando la seguridad de la Ciudad.' },
      { title: 'Desarrollo humano y Salud', text: 'Nos comprometimos a promover la integración social, la igualdad de oportunidades y el acceso a un sistema de salud de calidad en la Ciudad. Estamos construyendo nuevos y modernizados Centros de Salud con más equipos médicos, impulsando el desarrollo e integración de zonas históricamente relegadas, y facilitando el acceso a la vivienda para todos los vecinos.' },
      { title: 'Género', text: 'Queremos una Ciudad en donde todos tengamos los mismos derechos y las mismas oportunidades. Trabajamos para que las mujeres puedan transitar y disfrutar el espacio público seguras y sin violencia, para que puedan desarrollar su máximo potencial y que sean aún más protagonistas del crecimiento y desarrollo de la Ciudad.' }
    ];

    $scope.getIntro = function ( title ) {
      let texto = $scope.textos.find ( function (texto) {
        return title.toLowerCase() === texto.title.toLowerCase();
      });
      return texto.text;
    };

    $scope.mandato = function () {
      var dateStart = new Date("12/9/2015");
      var dateNow = new Date();
      var dateEnd = new Date('12/8/2019');
      var timeDiffNow = Math.abs(dateNow.getTime() - dateStart.getTime());
      var timeDiffTotal = Math.abs(dateEnd.getTime() - dateStart.getTime());
      var diffDaysNow = Math.ceil(timeDiffNow / (1000 * 3600 * 24));
      var diffDaysTotal = Math.ceil(timeDiffTotal / (1000 * 3600 * 24));
      var diffPc = Math.round((diffDaysNow / diffDaysTotal) * 100)
      $scope.pcMandato = diffPc;
      $scope.currentMonth = $scope.months[dateNow.getMonth()];
    };

    $scope.processObras = function () {

      // En proceso
      let totalAccionesSinTerminar = 0;
      $scope.dataCompromisos.map( function (compromiso) {
        if ( parseInt( compromiso.porcentaje_completado ) < 100 ) {
          $scope.dataObras.map ( function (obra)  {
            if ( parseInt(compromiso.numero) === parseInt(obra.numero) ) {
              totalAccionesSinTerminar++;
            }
          });
        }
      });
      $scope.totalAccionesSinTerminar = totalAccionesSinTerminar;

      // Zonificacion
      let totalZonaNorte = 0;
      let totalZonaSur = 0;
      let totalZonaCentro = 0;
      $scope.dataObras.map ( function (obra) {
        let comuna = parseInt ( obra.Comuna );
        if ( $scope.zonaNorte.includes(comuna) ) {
          totalZonaNorte++;
        } else if ( $scope.zonaSur.includes(comuna) ) {
          totalZonaSur++;
        } else if ( $scope.zonaCentro.includes(comuna) ) {
          totalZonaCentro++;
        }
      });
      $scope.totalZonaNorte = totalZonaNorte;
      $scope.totalZonaSur = totalZonaSur;
      $scope.totalZonaCentro = totalZonaCentro;
    };

    $scope.processCompromisos = function () {

      // Compromisos por cada area
      let totalProgress = 0;
      let totalCompromisos = 0;
      let totalCumplidos = 0;
      let totalCumplidos70 = 0;
      let totalCumplidos50 = 0;


      $scope.dataAvances.map ( function (area) {
        let progress = 0;
        area.compromisos.map ( function (compromiso) {
          let pc = parseInt(compromiso.porcentaje_completado);
          progress += pc;
          totalProgress += pc;
          if ( pc === 100 ) {
            totalCumplidos++;
          } else if ( pc >= 70 ) {
            totalCumplidos70++;
          } else if ( pc >= 50 && pc < 70 ) {
            totalCumplidos50++;
          }
          totalCompromisos++;
        });
        area.progress = Math.round(progress / area.compromisos.length);
      });

      $scope.totalProgress = Math.round(totalProgress / totalCompromisos);
      $scope.totalCompromisos = totalCompromisos;
      $scope.totalCumplidos = totalCumplidos;
      $scope.totalCumplidos70 = totalCumplidos70;
      $scope.totalCumplidos50 = totalCumplidos50;
    };

    $scope.posInArray = function(key, ay) {
      for ( let i = 0; i < ay.length; i++ ) {
        if ( ay[i].area === key ) {
          return i;
        }
      }
      return -1;
    };

    $scope.buildIFrameURL = function(compromiso) {
      let appHtml = '/app.html';
      let compromisoAnchor = '#c' + (parseInt(compromiso) < 10 ? '0' + compromiso : compromiso);
      let childId = 'childId=pym-container';
      let initialWidth = 'initialWidth=1140';
      let parentUrl = 'parentUrl=' + $location.$$absUrl;
      return appHtml + '?' + initialWidth + '&' + childId + '&' + parentUrl + compromisoAnchor;
    };

  });
