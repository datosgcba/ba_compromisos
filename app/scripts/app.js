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
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/c01', {
        templateUrl: 'views/c01.html',
        controller: 'Compromiso01Ctrl',
        controllerAs: 'c01'
      })
      .otherwise({
        redirectTo: '/'
      });
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
          return this.baseUrl + '?source_format=csv&source='+csv+ '&callback=JSON_CALLBACK'
      };
  });

