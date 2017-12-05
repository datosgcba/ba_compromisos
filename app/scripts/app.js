'use strict';
$.urlParam = function(url,name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    if (results===null){
       return null;
    }
    else{
       return results[1] || 0;
    }
};
/**
 * @ngdoc overview
 * @name compromisosSiteApp
 * @description
 * # compromisosSiteApp
 *
 * Main module of the application.
 */
angular
  .module('compromisosSiteApp', [
    'ngRoute',
    'duScroll',
    'ngSanitize',
    'ngYoutubeEmbed',
    'iso.directives', 
    'hljs'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/c01', {templateUrl: 'views/c01.html',controller: 'Compromiso01Ctrl',controllerAs: 'c01'})
      .when('/c02', {templateUrl: 'views/c02.html',controller: 'Compromiso02Ctrl',controllerAs: 'c02'})
      .when('/c03', {templateUrl: 'views/c03.html',controller: 'Compromiso03Ctrl',controllerAs: 'c03'})
      .when('/c04', {templateUrl: 'views/c04.html',controller: 'Compromiso04Ctrl',controllerAs: 'c04'})
      .when('/c05', {templateUrl: 'views/c05.html',controller: 'Compromiso05Ctrl',controllerAs: 'c05'})
      .when('/c06', {templateUrl: 'views/c06.html',controller: 'Compromiso06Ctrl',controllerAs: 'c06'})
      .when('/c07', {templateUrl: 'views/c07.html',controller: 'Compromiso07Ctrl',controllerAs: 'c07'})
      .when('/c08', {templateUrl: 'views/c08.html',controller: 'Compromiso08Ctrl',controllerAs: 'c08'})
      .when('/c09', {templateUrl: 'views/c09.html',controller: 'Compromiso09Ctrl',controllerAs: 'c09'})
      .when('/c10', {templateUrl: 'views/c10.html',controller: 'Compromiso10Ctrl',controllerAs: 'c10'})
      .when('/c11', {templateUrl: 'views/c11.html',controller: 'Compromiso11Ctrl',controllerAs: 'c11'})
      .when('/c12', {templateUrl: 'views/c12.html',controller: 'Compromiso12Ctrl',controllerAs: 'c12'})
      .when('/c13', {templateUrl: 'views/c13.html',controller: 'Compromiso13Ctrl',controllerAs: 'c13'})
      .when('/c14', {templateUrl: 'views/c14.html',controller: 'Compromiso14Ctrl',controllerAs: 'c14'})
      .when('/c15', {templateUrl: 'views/c15.html',controller: 'Compromiso15Ctrl',controllerAs: 'c15'})
      .when('/c16', {templateUrl: 'views/c16.html',controller: 'Compromiso16Ctrl',controllerAs: 'c16'})
      .when('/c17', {templateUrl: 'views/c17.html',controller: 'Compromiso17Ctrl',controllerAs: 'c17'})
      .when('/c18', {templateUrl: 'views/c18.html',controller: 'Compromiso18Ctrl',controllerAs: 'c18'})
      .when('/c19', {templateUrl: 'views/c19.html',controller: 'Compromiso19Ctrl',controllerAs: 'c19'})
      .when('/c20', {templateUrl: 'views/c20.html',controller: 'Compromiso20Ctrl',controllerAs: 'c20'})
      .when('/c21', {templateUrl: 'views/c21.html',controller: 'Compromiso21Ctrl',controllerAs: 'c21'})
      .when('/c22', {templateUrl: 'views/c22.html',controller: 'Compromiso22Ctrl',controllerAs: 'c22'})
      .when('/c23', {templateUrl: 'views/c23.html',controller: 'Compromiso23Ctrl',controllerAs: 'c23'})
      .when('/c24', {templateUrl: 'views/c24.html',controller: 'Compromiso24Ctrl',controllerAs: 'c24'})
      .when('/c25', {templateUrl: 'views/c25.html',controller: 'Compromiso25Ctrl',controllerAs: 'c25'})
      .when('/c26', {templateUrl: 'views/c26.html',controller: 'Compromiso26Ctrl',controllerAs: 'c26'})
      .when('/c27', {templateUrl: 'views/c27.html',controller: 'Compromiso27Ctrl',controllerAs: 'c27'})
      .when('/c28', {templateUrl: 'views/c28.html',controller: 'Compromiso28Ctrl',controllerAs: 'c28'})
      .when('/c29', {templateUrl: 'views/c29.html',controller: 'Compromiso29Ctrl',controllerAs: 'c29'})
      .when('/c30', {templateUrl: 'views/c30.html',controller: 'Compromiso30Ctrl',controllerAs: 'c30'})
      .when('/c31', {templateUrl: 'views/c31.html',controller: 'Compromiso31Ctrl',controllerAs: 'c31'})
      .when('/c32', {templateUrl: 'views/c32.html',controller: 'Compromiso32Ctrl',controllerAs: 'c32'})
      .when('/c33', {templateUrl: 'views/c33.html',controller: 'Compromiso33Ctrl',controllerAs: 'c33'})
      .when('/c34', {templateUrl: 'views/c34.html',controller: 'Compromiso34Ctrl',controllerAs: 'c34'})
      .when('/c35', {templateUrl: 'views/c35.html',controller: 'Compromiso35Ctrl',controllerAs: 'c35'})
      .when('/c36', {templateUrl: 'views/c36.html',controller: 'Compromiso36Ctrl',controllerAs: 'c36'})
      .when('/c37', {templateUrl: 'views/c37.html',controller: 'Compromiso37Ctrl',controllerAs: 'c37'})
      .when('/c38', {templateUrl: 'views/c38.html',controller: 'Compromiso38Ctrl',controllerAs: 'c38'})
      .when('/c39', {templateUrl: 'views/c39.html',controller: 'Compromiso39Ctrl',controllerAs: 'c39'})
      .when('/c40', {templateUrl: 'views/c40.html',controller: 'Compromiso40Ctrl',controllerAs: 'c40'})
      .when('/c41', {templateUrl: 'views/c41.html',controller: 'Compromiso41Ctrl',controllerAs: 'c41'})
      .when('/c42', {templateUrl: 'views/c42.html',controller: 'Compromiso42Ctrl',controllerAs: 'c42'})
      .when('/c43', {templateUrl: 'views/c43.html',controller: 'Compromiso43Ctrl',controllerAs: 'c43'})
      .when('/c44', {templateUrl: 'views/c44.html',controller: 'Compromiso44Ctrl',controllerAs: 'c44'})
      .when('/c45', {templateUrl: 'views/c45.html',controller: 'Compromiso45Ctrl',controllerAs: 'c45'})
      .when('/c46', {templateUrl: 'views/c46.html',controller: 'Compromiso46Ctrl',controllerAs: 'c46'})
      .when('/c47', {templateUrl: 'views/c47.html',controller: 'Compromiso47Ctrl',controllerAs: 'c47'})
      .when('/c48', {templateUrl: 'views/c48.html',controller: 'Compromiso48Ctrl',controllerAs: 'c48'})
      .when('/c49', {templateUrl: 'views/c49.html',controller: 'Compromiso49Ctrl',controllerAs: 'c49'})
      .when('/c50', {templateUrl: 'views/c50.html',controller: 'Compromiso50Ctrl',controllerAs: 'c50'})
      .otherwise({
        redirectTo: '/'
      });
  })
  .service('SlugColorService', function () {

      this.colorsBySlug = {
        'social':"#c15180",
        'disfrute':"#3abaaf",
        'humana':"#f58b45",
        'creatividad':"#7c4194"
      };

      this.getColorBySlug = function(slug){
        if(slug){
          return this.colorsBySlug[slug.toLowerCase()];
        }
        else{
          return this.colorsBySlug;
        }
      };
  })
  .service('LoadSVGService', function () {
    this.loadIcon = function(name,cb){
      name = (name.length==1)?'0'+name:name;
      var icon = 'images/iconos_v2/GCBA-compromisos-icons-'+name+'.svg';
      d3.xml(icon, "image/svg+xml", function(error, xml) {
        cb(document.importNode(xml.documentElement, true));
      });
    };
  })
  .service('GetSVGNameService', function () {
    this.getUrl = function(name){
      name = (name.length==1)?'0'+name:name;
      var icon = 'images/iconos_v2/GCBA-compromisos-icons-'+name+'.svg';
      return icon;
    };
  })
  .service('UrlService', function () {
      if(!window.COMPROMISOS_CONFIG){
        console.error('Archivo de configuración inexistente, utilizando configuración default de desarrollo.');
        window.COMPROMISOS_CONFIG = {
          BASE_URL: 'http://api.topranking.link/',
          HOME_CSV: 'https://goo.gl/w0wnOj',
          /*HOME_CSV: 'https://goo.gl/Nj6FZm'*/
          /*
          BASE_URL: 'https://compromisos-csv.buenosaires.gob.ar',
          HOME_CSV: 'http://recursos-data.buenosaires.gob.ar/ckan2/compromisos/master_compromisos.csv'
          */

        };

      }
      this.baseUrl = window.COMPROMISOS_CONFIG.BASE_URL;
      this.urls = {
        'home': this.baseUrl + '?source_format=csv&source='+window.COMPROMISOS_CONFIG.HOME_CSV
      };
      this.getUrlByPage = function(page) {
          return this.urls[page] + '&callback=JSON_CALLBACK';
      };
      this.getUrlByCsv = function(csv) {
          return this.baseUrl + '?source_format=csv&source='+csv+ '&callback=JSON_CALLBACK';
      };
  })
  .run(function($rootScope,$interval) {

    //Locale!
    var es_ES = {
        "decimal": ",",
        "thousands": ".",
        "grouping": [3],
        "currency": ["€", ""],
        "dateTime": "%a %b %e %X %Y",
        "date": "%d/%m/%Y",
        "time": "%H:%M:%S",
        "periods": ["AM", "PM"],
        "days": ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
        "shortDays": ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
        "months": ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
        "shortMonths": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    };

    $rootScope.d3Locale_ES = d3.locale(es_ES);

  // instance-injector
    var intervalID,max=350,coincidence=0;
    var updateFrame = function(){
        $interval.cancel(intervalID);
        intervalID = $interval(function(){
          //console.log('lanza!');
          $('.detalle-frame').not('.ignore-adjust').each(function(i,e){
            $(e).css('height','auto');
            var h = $(e).outerHeight();
            if(h>max){
              max = h;
            }
            //console.log(i,h,max);
          });
          $('.detalle-frame').not('.ignore-adjust').css('height',max+'px');
        },2000);
    };

    function adjust() {

      updateFrame();

      setTimeout(function(){
        $interval.cancel(intervalID);
      },10000);

    };

    setTimeout(function(){
      adjust();
    },2000);

    var id;
    $(window).resize(function() {
        clearTimeout(id);
        id = setTimeout(function(){
          adjust();
        }, 500);
    });

  });
