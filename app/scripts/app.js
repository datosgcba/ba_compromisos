'use strict';

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
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngYoutubeEmbed'
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
      .otherwise({
        redirectTo: '/'
      });
  })
  .service('SlugColorService', function () {
      this.list = {
          'protección e integración social': 'social',
          'convivencia': 'convivencia',
          'hábitat y movilidad': 'movilidad',
          'ciudad inteligente y sustentable': 'smart'
        };

      this.getCategorySlug = function(cat){
        return this.list[cat.toLowerCase()];
      };
  })
  .service('LoadSVGService', function () {
    this.loadIcon = function(name,cb){    
      var icon = 'images/iconos/GCBA-compromisos-icons-'+name+'.svg';
      d3.xml(icon, "image/svg+xml", function(error, xml) {
        cb(document.importNode(xml.documentElement, true));
      });
    };
  })
  .service('UrlService', function () {
      this.baseUrl = 'http://palamago.com.ar/api/';
      this.urls = {
        //Datos Prod CSV
        //'home': 'http://palamago.com.ar/api/?source_format=csv&source=https://goo.gl/NZ8vyv'
        // Datos Ejemplo CSV
        'home': this.baseUrl + '?source_format=csv&source=https://goo.gl/Cid4QS'
      };
      this.getUrlByPage = function(page) {
          return this.urls[page] + '&callback=JSON_CALLBACK';
      };
      this.getUrlByCsv = function(csv) {
          return this.baseUrl + '?source_format=csv&source='+csv+ '&callback=JSON_CALLBACK';
      };
  });

