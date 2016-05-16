"use strict";angular.module("compromisosSiteApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","gridshore.c3js.chart"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",controllerAs:"main"}).when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home"}).when("/c01",{templateUrl:"views/c01.html",controller:"Compromiso01Ctrl",controllerAs:"c01"}).otherwise({redirectTo:"/"})}]).service("UrlService",function(){this.urls={home:"http://palamago.com.ar/api/?source_format=csv&source=https://goo.gl/NZ8vyv"},this.getUrl=function(a){return this.urls[a]}}),angular.module("compromisosSiteApp").controller("MainCtrl",function(){}),angular.module("compromisosSiteApp").controller("HomeCtrl",["$scope","$timeout","$http","UrlService",function(a,b,c,d){a.data=[],a.loading=!0;var e=d.getUrl("home")+"&callback=JSON_CALLBACK";c.jsonp(e).success(function(b){a.loading=!1,a.data=b,console.log(b)})}]),angular.module("compromisosSiteApp").controller("Compromiso01Ctrl",function(){}),angular.module("compromisosSiteApp").run(["$templateCache",function(a){a.put("views/c01.html",'<div class="row"> <div class="col-md-12"> <h1>Compromiso 01</h1> </div> </div> <div class="row"> <div class="col-md-6"> <p> <c3chart bindto-id="gauge-plot1-chart"> <chart-column column-id="Data 1" column-values="70" column-type="gauge"> <chart-gauge min="50" max="75" units=" hours" width="39"> </c3chart> </p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p> </div> <div class="col-md-6"> <c3chart bindto-id="chart6"> <chart-legend show-legend="true" legend-position="right"> <chart-colors color-pattern="#1f77b4,#ffbb78,#2ca02c,#ff7f0e"> <chart-tooltip show-tooltip="true" group-tooltip="false"> <chart-column column-id="data 1" column-name="Data 1" column-color="red" column-values="30,200,100,400,150,250" column-type="spline"> <chart-column column-id="data 2" column-name="Data 2" column-color="green" column-values="50,20,10,40,15,25" column-type="line"> </c3chart> </div> </div>'),a.put("views/home.html",'<div class="row"> <div class="col-md-12"> <h1>Home</h1> </div> </div> <hr> <div class="row"> <div class="col-sm-3"> <h3 class="text-center">Ciudad inteligente y sustentable</h3> </div> <div class="col-sm-3"> <h3 class="text-center">Convivencia</h3> </div> <div class="col-sm-3"> <h3 class="text-center">Movilidad</h3> </div> <div class="col-sm-3"> <h3 class="text-center">Protección e integración social</h3> </div> </div> <hr> <p ng-show="loading">Cargando...</p> <div ng-hide="loading"> <div class="row"> <div class="col-sm-4"> <p class="text-center">Stacked bar chart</p> </div> <div class="col-sm-4"> <p class="text-center">Bar Chart</p> </div> <div class="col-sm-4"> <p class="text-center">Bubble chart</p> </div> </div> <hr> <div class="row"> <div class="col-sm-12"> <p class="text-center">Chart de menú</p> </div> </div> <hr> <div class="row"> <div class="col-sm-12"> <p ng-repeat="(k,v) in data">{{v.numero}}. {{v.titulo}}</p> </div> </div> </div>'),a.put("views/main.html",'<div class="row"> <div class="col-md-12"> <h1>¡Hola, Buenos Aires!</h1> <p>Esta es la página de prueba para visualizar los compromisos de GCBA</p> <ul> <li><a class="btn btn-primary" href="#home" target="_blank">Home</a></li> <li><a class="btn btn-primary" href="#c01" target="_blank">Compromiso 01</a></li> <li>...</li> </ul> <p></p> </div> </div>')}]);