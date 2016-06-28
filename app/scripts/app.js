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
      .when('/c04', {templateUrl: 'views/c04.html',controller: 'Compromiso04Ctrl',controllerAs: 'c04'})
      .when('/c05', {templateUrl: 'views/c05.html',controller: 'Compromiso05Ctrl',controllerAs: 'c05'})
      .when('/c07', {templateUrl: 'views/c07.html',controller: 'Compromiso07Ctrl',controllerAs: 'c07'})
      .when('/c10', {templateUrl: 'views/c10.html',controller: 'Compromiso10Ctrl',controllerAs: 'c10'})  
      .when('/c16', {templateUrl: 'views/c16.html',controller: 'Compromiso16Ctrl',controllerAs: 'c16'})  
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

      this.colorsBySlug = {
        'social':"#c15180",
        'convivencia':"#3abaaf",
        'movilidad':"#f58b45",
        'smart':"#7c4194"
      };

      this.getCategorySlug = function(cat){
        return this.list[cat.toLowerCase()];
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

