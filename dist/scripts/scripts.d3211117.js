"use strict";angular.module("compromisosSiteApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngYoutubeEmbed"]).config(["$routeProvider",function(a){a.when("/home",{templateUrl:"views/home.html",controller:"HomeCtrl",controllerAs:"home"}).when("/c01",{templateUrl:"views/c01.html",controller:"Compromiso01Ctrl",controllerAs:"c01"}).when("/c02",{templateUrl:"views/c02.html",controller:"Compromiso02Ctrl",controllerAs:"c02"}).when("/c03",{templateUrl:"views/c03.html",controller:"Compromiso03Ctrl",controllerAs:"c03"}).otherwise({redirectTo:"/"})}]).service("SlugColorService",function(){this.list={"protección e integración social":"social",convivencia:"convivencia","hábitat y movilidad":"movilidad","ciudad inteligente y sustentable":"smart"},this.getCategorySlug=function(a){return this.list[a.toLowerCase()]}}).service("LoadSVGService",function(){this.loadIcon=function(a,b){var c="images/iconos/GCBA-compromisos-icons-"+a+".svg";d3.xml(c,"image/svg+xml",function(a,c){b(document.importNode(c.documentElement,!0))})}}).service("UrlService",function(){this.baseUrl="http://palamago.com.ar/api/",this.urls={home:this.baseUrl+"?source_format=csv&source=https://goo.gl/Cid4QS"},this.getUrlByPage=function(a){return this.urls[a]+"&callback=JSON_CALLBACK"},this.getUrlByCsv=function(a){return this.baseUrl+"?source_format=csv&source="+a+"&callback=JSON_CALLBACK"}}),angular.module("compromisosSiteApp").controller("HomeCtrl",["$scope","$timeout","$http","UrlService","SlugColorService","LoadSVGService",function(a,b,c,d,e,f){function g(a){for(var b=0,c=0;c<A.length;c++){var d=A[c],e=parseInt(a.porcentaje_completado);if(e>=d.from&&e<d.to){b=c;break}}return a.percentageGroup=b,b}function h(b,c,d){a.$apply(function(){a.currentCompromise=b});var e=parseInt(d3.select("#compromiso-detail").style("height").replace("px","")),f=parseInt($(window).height()),g=parseInt(d.clientY);d3.select("#compromiso-detail").style("top",d.clientY+"px");var h=g+e-f;h>0&&d3.select("#filler").style("height",h+"px")}function i(){var b=["x"].concat(a.availableYears);angular.forEach(a.categoriesGroup,function(a){a.years=d3.nest().key(function(a){return a.cumplimiento1}).rollup(function(a){return a.length}).entries(a.values)});var c=[];c.push(b),angular.forEach(a.categoriesGroup,function(b){var d=[];d.push(b.key),angular.forEach(a.availableYears,function(a){for(var c=0,e=0;e<b.years.length;e++){var f=b.years[e];if(a===f.key){c=f.values;break}}d.push(c)}),c.push(d)});var d=d3.max(a.finishedYearsGroup,function(a){return a.values.length}),e=d3.range(0,d+1).map(function(a){return{value:a}});a.charts.date_chart=c3.generate({bindto:"#date_chart",data:{x:"x",columns:c,type:"bar",groups:[a.availableCategories],colors:angular.copy(a.colorsByCategory)},size:{height:220},padding:{top:20,right:20,bottom:20,left:20},legend:{show:!1},axis:{x:{type:"category"},y:{show:!1}},grid:{y:{lines:e}}})}function j(){var b=[];angular.forEach(a.availableCategories,function(a){b.push([a,1,1,1,1,1])});var c=4,d=d3.range(0,c+1).map(function(a){return{value:a}});a.charts.home_chart=c3.generate({bindto:"#home_chart",data:{columns:b,type:"bar",groups:[a.availableCategories],colors:angular.copy(a.colorsByCategory)},size:{height:220},padding:{top:30,right:30,bottom:30,left:30},legend:{show:!1},axis:{x:{type:"category",show:!1},y:{show:!1,padding:{top:0,bottom:1}}},grid:{y:{lines:d}}})}function k(){var b=["x","0-25%","25-50%","50-75%","75-100%"];angular.forEach(a.categoriesGroup,function(a){a.percentages=d3.nest().key(function(a){return a.percentageGroup}).rollup(function(a){return a.length}).entries(a.values)});var c=[];c.push(b),angular.forEach(a.categoriesGroup,function(a){var b=[];b.push(a.key),angular.forEach(A,function(c,d){for(var e=0,f=0;f<a.percentages.length;f++){var g=a.percentages[f];if(d===parseInt(g.key)){e=g.values;break}}b.push(e)}),c.push(b)});var d=d3.max(a.finishedPercentageGroup,function(a){return a.values.length}),e=d3.range(0,d+1).map(function(a){return{value:a}});a.charts.state_chart=c3.generate({bindto:"#state_chart",data:{x:"x",columns:c,type:"bar",groups:[a.availableCategories],colors:angular.copy(a.colorsByCategory)},size:{height:220},padding:{top:20,right:20,bottom:20,left:20},legend:{show:!1},axis:{x:{type:"category"},y:{max:10,show:!1,padding:{top:0,bottom:0}}},grid:{y:{lines:e}}})}function l(){m(a.colorsByCategory)}function m(b){a.charts.state_chart.data.colors(b),a.charts.date_chart.data.colors(b),a.charts.home_chart.data.colors(b),angular.forEach(b,function(a,b){d3.selectAll(".leaf."+b+" circle").style("fill",a)})}function n(b){var c={social:"#e6e6e6",convivencia:"#e6e6e6",movilidad:"#e6e6e6",smart:"#e6e6e6"};c[b]=a.colorsByCategory[b],m(c)}function o(){var b=220,c=d3.layout.pack().sort(null).size([b,b]).value(function(a){return parseInt(a.porcentaje_completado)});a.charts.category_chart||(a.charts.category_chart={},a.charts.category_chart.svg=d3.select("#category_chart").append("svg").attr("class","bubble-container").attr("width",300).attr("height",220));for(var d=a.charts.category_chart.svg,e={name:"categories",children:[]},f=0;f<a.categoriesGroup.length;f++){var g=a.categoriesGroup[f];e.children.push({name:g.key,children:g.values})}var h=d.datum(e).selectAll(".node").data(c.nodes).enter().append("g").attr("class",function(a){var b=a.children?"node":"leaf node",c=a.slug?a.slug:a.name;return b+" "+c}).attr("transform",function(a){return"translate("+a.x+","+a.y+")"});h.append("title").text(function(a){return a.name+(a.children?"":": "+parseInt(a.porcentaje_completado))}),h.append("circle").attr("r",function(a){return a.r}).filter(function(a){return"categories"!==a.name}).style("fill",function(b){return a.colorsByCategory[b.slug]})}function p(){function b(){a.charts.menu_chart.svg.transition().duration(x).attr("width",v).attr("height",w)}function c(){v=$(window).width(),y=768>v,z=0;var c=d(a.charts.menu_chart.items_group.selectAll("g.compromiso-item"),0);w=c*o,b(),l([])}function d(a,b,c){b+=y&&c?o:0,z=y?0:z;var d=Math.floor((v-z)/o),e=0,f=0,g=(v-z-d*o)/2;return a.transition().duration(x).attr("transform",function(c,h){var i=e*o+g+z,j=f*o+b;return d-1>e?e++:a[0].length!==h+1&&(e=0,f++),"translate("+i+","+j+")"}),f+1+(y&&c?1:0)}function i(){v=$(window).width(),y=768>v;var c=0;z=v/3;var e=[];angular.forEach(a.finishedPercentageGroup,function(b){e.push({title:A[b.key].from+"% - "+A[b.key].to+"%",rows:c}),c+=d(a.charts.menu_chart.items_group.selectAll("g.avance-"+b.key),c*o,!0)}),w=c*o,b(),l(e)}function j(){v=$(window).width(),y=768>v;var c=0;z=v/3;var f=[];angular.forEach(a.categoriesGroupText,function(b){f.push({title:b.key,rows:c}),c+=d(a.charts.menu_chart.items_group.selectAll("g.categoria-"+e.getCategorySlug(b.key)),c*o,!0)}),w=c*o,b(),l(f)}function k(){v=$(window).width(),y=768>v;var c=0;z=v/3;var e=[];angular.forEach(a.finishedYearsGroup,function(b){e.push({title:b.key,rows:c}),c+=d(a.charts.menu_chart.items_group.selectAll("g.cumplimiento-"+b.key),c*o,!0)}),w=c*o,b(),l(e)}function l(b){a.charts.menu_chart.labels_group.selectAll("*").remove();var c=a.charts.menu_chart.labels_group.selectAll(".label-group").data(b);c.enter().append("g").classed("label-group",!0).each(function(a){var b=d3.select(this);b.append("rect").classed("label-group-shape",!0).classed("shape",!0).attr("height",o).attr("width",y?v:v/3).attr("fill","none"),b.append("text").classed("label-group-text",!0).classed("wrap",!0).attr("text-anchor","start").attr("opacity",1).text(function(a){return a.title}),b.attr("transform",function(){return"translate(0,"+a.rows*o+")"});var c=b.select("text");d3plus.textwrap().container(c).shape("square").align("left").valign("middle").padding(3).draw()})}function m(){var b={width:o,height:o/3};d3plus.textwrap().config(b),a.charts.menu_chart.items_group.selectAll("g.compromiso-item").data(B).enter().append("g").attr("class",function(a){var b=[];return b.push("cumplimiento-"+a.cumplimiento1),b.push("categoria-"+a.slug),b.push("categoria-unselected"),b.push("avance-"+g(a)),b.join(" ")}).classed("compromiso-item",!0).attr("id",function(a){return"c"+a.numero}).each(function(a){var b=d3.select(this);b.append("rect").classed("compromiso-frame",!0).attr("x",0).attr("y",0).attr("height",o).attr("width",o).attr("fill","white"),b.append("rect").classed("compromiso-label-shape",!0).classed("shape",!0).attr("x",p).attr("y",o/2).attr("height",o/2-p).attr("width",o-2*p).attr("fill","none"),b.append("text").classed("compromiso-label",!0).classed("wrap",!0).attr("id","c"+a.numero+"-text").attr("opacity",0).text(function(){return a.titulo}),b.append("g").classed("compromiso-icon",!0).attr("id",function(a){return"c"+a.numero+"-icon"}).attr("transform",function(){var a=o/2-25,b=o/3-25;return"translate("+a+","+b+")"}).each(function(a){var b=this;f.loadIcon(a.icono,function(a){$(a).attr("width",50).attr("height",50).get(0),b.appendChild(a.cloneNode(!0))})}),b.append("rect").classed("compromiso-action",!0).attr("x",p).attr("y",p).attr("height",o-2*p).attr("width",o-2*p).attr("fill","transparent").on("mouseover",function(a){t(a.slug),q(a.numero)}).on("mouseout",function(){u(),r();var a=$(".c-option-selected");a.size()&&s(a.data("slug"))}).on("click",function(){h(a,d3.mouse(this),d3.event)})}).transition().duration(0).attr("transform",function(){var a=v/2-o/2,b=w/2-o/2;return"translate("+a+","+b+")"}).each("end",function(a){var b=d3.select("text#c"+a.numero+"-text");d3plus.textwrap().container(b).shape("square").align("center").valign("top").padding(3).draw(),b.transition().attr("opacity",1)})}function n(){m(),a.charts.menu_chart.api={group:function(a){switch(a){case"home":c();break;case"date":k();break;case"category":j();break;case"state":i()}}},setTimeout(function(){a.charts.menu_chart.api.group(a.selectedGroup)},1e3)}var o=150,p=5,v=$(window).width(),w=500,x=500,y=768>v,z=v/3,B=angular.copy(a.data);a.charts.menu_chart||(a.charts.menu_chart={},a.charts.menu_chart.svg=d3.select("#menu_chart").append("svg").attr("width",v).attr("height",w).attr("class","menu_chart"),a.charts.menu_chart.items_group=a.charts.menu_chart.svg.append("g").classed("items-container",!0),a.charts.menu_chart.labels_group=a.charts.menu_chart.svg.append("g").classed("labels-container",!0)),n()}function q(a){$(".compromiso-item").addClass("categoria-unselected"),$(".compromiso-item#c"+a).removeClass("categoria-unselected")}function r(){$(".compromiso-item").addClass("categoria-unselected")}function s(a){$(".compromiso-item").addClass("categoria-unselected"),$(".compromiso-item.categoria-"+a).removeClass("categoria-unselected")}function t(a){$(".c-option").removeClass("c-option-hover"),$('.c-option[data-slug="'+a+'"]').addClass("c-option-hover")}function u(){$(".c-option").removeClass("c-option-hover")}function v(a){$(".c-option").removeClass("c-option-selected"),$('.c-option[data-slug="'+a+'"]').addClass("c-option-selected")}function w(){$(".c-option").removeClass("c-option-selected")}function x(){$(".c-option").mouseover(function(){var a=$(this).data("slug");a&&(t(a),s(a),n(a))}).mouseout(function(){var a=$(this).data("slug");if(a){var b=$(".c-option-selected");b.size()?(s(b.data("slug")),n(b.data("slug"))):(r(),l()),u()}}).click(function(){var b=$(this).data("slug");b&&($(this).hasClass("c-option-selected")?(w(),l()):(v(b),s(b),n(b),a.$apply(function(){a.selectedCategory=b})))})}var y=new pym.Child({polling:1e3});y.sendHeight(),a.data=[],a.loading=!0,a.charts={},a.selectedGroup="home";var z=d.getUrlByPage("home");c.jsonp(z).success(function(b){a.data=b.map(function(a){return a.slug=e.getCategorySlug(a.categoria),a}),a.loading=!1,a.groupData(),a.renderCharts()}),a.groupData=function(){a.categoriesGroup=d3.nest().key(function(a){return a.slug}).entries(a.data),a.categoriesGroupText=d3.nest().key(function(a){return a.categoria}).entries(a.data),a.availableCategories=[],angular.forEach(a.categoriesGroup,function(b){a.availableCategories.push(b.key)}),angular.forEach(a.categoriesGroup,function(a){a.finishedYearsGroup=d3.nest().key(function(a){return a.cumplimiento1}).rollup(function(a){return a.length}).entries(a.values)}),a.finishedYearsGroup=d3.nest().key(function(a){return a.cumplimiento1}).entries(a.data),angular.forEach(a.finishedYearsGroup,function(a){a.categoryGroup=d3.nest().key(function(a){return e.getCategorySlug(a.categoria)}).rollup(function(a){return a.length}).entries(a.values)}),a.availableYears=[],angular.forEach(a.finishedYearsGroup,function(b){a.availableYears.push(b.key)}),a.availableYears=a.availableYears.sort(),a.finishedPercentageGroup=d3.nest().key(function(a){return g(a)}).entries(a.data)};var A=[];A.push({from:0,to:25}),A.push({from:25,to:50}),A.push({from:50,to:75}),A.push({from:75,to:100}),a.colorsByCategory={social:"#fccf2b",convivencia:"#3abaaf",movilidad:"#f58b45",smart:"#7c4194"},a.renderCharts=function(){x(),j(),i(),k(),o(),p()},a.closeDetail=function(){a.currentCompromise=null,d3.select("#filler").style("height","0px")},a.onChangeCategory=function(){""!==a.selectedCategory?(v(a.selectedCategory),s(a.selectedCategory),n(a.selectedCategory)):(w(),l())},a.onChangeGroup=function(){a.groupMenu(a.selectedGroup)},a.groupMenu=function(b){a.selectedGroup=b,a.charts.menu_chart.api.group(a.selectedGroup)};var B;$(window).resize(function(){clearTimeout(B),B=setTimeout(function(){a.charts.menu_chart&&a.charts.menu_chart.api.group(a.selectedGroup),a.charts.category_chart&&o()},500)})}]),angular.module("compromisosSiteApp").controller("Compromiso01Ctrl",["UrlService","$scope","$http","SlugColorService","LoadSVGService",function(a,b,c,d,e){var f=a.getUrlByPage("home"),g=new pym.Child({polling:1e3});g.sendHeight();var h=window._;b.loading=!0,c.jsonp(f).success(function(a){b.currentCompromise=b.data=h.find(a,function(a){return 1===parseInt(a.numero)}),b.currentCompromise.slug=d.getCategorySlug(b.currentCompromise.categoria),b.currentCompromise.porcentaje_completado=parseInt(b.currentCompromise.porcentaje_completado),b.loading=!1,e.loadIcon(b.currentCompromise.icono,function(a){$("#icon-svg-container").html(a.cloneNode(!0))}),console.log(b.currentCompromise)}),b.youtubeLink="https://www.youtube.com/watch?v=AoZ98-TwqM4",b.completeConfig=function(a){return angular.merge(a,{data:{keys:{value:["baches"],x:"ano"}},axis:{x:{label:"Año"},y:{label:"Baches arreglados"}}})},b.prepareData=function(a){return a}}]),angular.module("compromisosSiteApp").controller("Compromiso02Ctrl",["UrlService","$scope","$http","SlugColorService","LoadSVGService",function(a,b,c,d,e){var f=a.getUrlByPage("home"),g=new pym.Child({polling:1e3});g.sendHeight();var h=window._;b.loading=!0,c.jsonp(f).success(function(a){b.currentCompromise=b.data=h.find(a,function(a){return 2===parseInt(a.numero)}),b.currentCompromise.slug=d.getCategorySlug(b.currentCompromise.categoria),b.currentCompromise.porcentaje_completado=parseInt(b.currentCompromise.porcentaje_completado),b.loading=!1,e.loadIcon(b.currentCompromise.icono,function(a){$("#icon-svg-container").html(a.cloneNode(!0))}),console.log(b.currentCompromise)}),b.youtubeLink="https://www.youtube.com/watch?v=AoZ98-TwqM4",b.completeConfig=function(a){return console.log("pasa complete config"),angular.merge(a,{data:{keys:{value:["baches"],x:"ano"}},axis:{x:{label:"Año"},y:{label:"Baches arreglados"}}})},b.prepareData=function(a){return a}}]),angular.module("compromisosSiteApp").controller("Compromiso03Ctrl",["UrlService","$scope","$http","SlugColorService","LoadSVGService",function(a,b,c,d,e){var f=a.getUrlByPage("home"),g=new pym.Child({polling:1e3});g.sendHeight();var h=window._;b.loading=!0,c.jsonp(f).success(function(a){b.currentCompromise=b.data=h.find(a,function(a){return 3===parseInt(a.numero)}),b.currentCompromise.slug=d.getCategorySlug(b.currentCompromise.categoria),b.currentCompromise.porcentaje_completado=parseInt(b.currentCompromise.porcentaje_completado),b.loading=!1,e.loadIcon(b.currentCompromise.icono,function(a){$("#icon-svg-container").html(a.cloneNode(!0))}),console.log(b.currentCompromise)}),b.youtubeLink="https://www.youtube.com/watch?v=AoZ98-TwqM4",b.completeConfig=function(a){return console.log("pasa complete config"),angular.merge(a,{data:{keys:{value:["baches"],x:"ano"}},axis:{x:{label:"Año"},y:{label:"Baches arreglados"}}})},b.prepareData=function(a){return a}}]),angular.module("compromisosSiteApp").directive("smartContent",function(){return{restrict:"E",replace:!0,scope:{url:"=url",dataCallback:"=dataCallback",configCallback:"=configCallback",template:"=template"},controller:["$scope","$timeout","UrlService","$http",function(a,b,c,d){function e(a){return null!==a.match(/\b\w*(youtu)\w*\b/)}function f(a){return null!==a.match(/\.(jpeg|jpg|gif|png)$/)}a.loading=!0,a.id="content-"+Math.floor(1e4*Math.random()),a.getTemplateUrl=function(){return a.template?a.template:e(a.url)?(a.loading=!1,"views/directives/youtubePlayer.html"):f(a.url)?(a.loading=!1,"views/directives/imageFull.html"):"views/directives/simpleChart.html"},a.chartConfigDefaults={data:{json:[]}},a.renderChart=function(){var e=c.getUrlByCsv(a.url);a.chartConfigDefaults.bindto="#"+a.id,d.jsonp(e).success(function(c){a.dataCallback?a.chartConfigDefaults.data.json=a.dataCallback(c):a.chartConfigDefaults.data.json=c,a.configCallback&&(a.chartConfigDefaults=a.configCallback(a.chartConfigDefaults)),b(function(){c3.generate(a.chartConfigDefaults),a.loading=!1},500)})}}],template:'<ng-include src="getTemplateUrl()"/>'}}),angular.module("compromisosSiteApp").run(["$templateCache",function(a){a.put("views/c01.html",'<p class="text-center" ng-show="loading">Cargando...</p> <div ng-hide="loading"> <div ng-include="\'views/includes/detail.html\'" ng-cloak ng-show="currentCompromise"></div> <div class="row"> <div ng-if="data.detalle_1" class="col-md-6 text-center"> <smart-content url="data.detalle_1" template=""></smart-content> </div> <div ng-if="data.detalle_2" class="col-md-6 text-center"> <smart-content url="data.detalle_2"></smart-content> </div> <div ng-if="data.detalle_3" class="col-md-6 text-center"> <smart-content url="data.detalle_3" data-callback="prepareData" config-callback="completeConfig"></smart-content> </div> <div ng-if="data.detalle_4" class="col-md-6 text-center"> <smart-content url="data.detalle_4"></smart-content> </div> </div> </div>'),a.put("views/c02.html",'<p class="text-center" ng-show="loading">Cargando...</p> <div ng-hide="loading"> <div ng-include="\'views/includes/detail.html\'" ng-cloak ng-show="currentCompromise"></div> <div class="row"> <div ng-if="data.detalle_1" class="col-md-6 text-center"> <smart-content url="data.detalle_1" template=""></smart-content> </div> <div ng-if="data.detalle_2" class="col-md-6 text-center"> <smart-content url="data.detalle_2"></smart-content> </div> <div ng-if="data.detalle_3" class="col-md-6 text-center"> <smart-content url="data.detalle_3" data-callback="prepareData" config-callback="completeConfig"></smart-content> </div> <div ng-if="data.detalle_4" class="col-md-6 text-center"> <smart-content url="data.detalle_4"></smart-content> </div> </div> </div>'),a.put("views/c03.html",'<p class="text-center" ng-show="loading">Cargando...</p> <div ng-hide="loading"> <div ng-include="\'views/includes/detail.html\'" ng-cloak ng-show="currentCompromise"></div> <div class="row"> <div ng-if="data.detalle_1" class="col-md-6 text-center"> <smart-content url="data.detalle_1" template=""></smart-content> </div> <div ng-if="data.detalle_2" class="col-md-6 text-center"> <smart-content url="data.detalle_2"></smart-content> </div> <div ng-if="data.detalle_3" class="col-md-6 text-center"> <smart-content url="data.detalle_3" data-callback="prepareData" config-callback="completeConfig"></smart-content> </div> <div ng-if="data.detalle_4" class="col-md-6 text-center"> <smart-content url="data.detalle_4"></smart-content> </div> </div> </div>'),a.put("views/directives/imageFull.html",'<span ng-show="loading">Cargando...</span> <img ng-hide="loading" ng-src="{{url}}" class="img-responsive">'),a.put("views/directives/simpleChart.html",'<span ng-show="loading">Cargando...</span> <div id="{{id}}" ng-init="renderChart()"></div>'),a.put("views/directives/youtubePlayer.html",'<ng-youtube-embed url="url" autoplay color="white" disablekb="true" end="20"> </ng-youtube-embed>'),a.put("views/home.html",'<div class="row hidden-device"> <div class="col-sm-3 c-option c-color-smart" data-slug="smart"> <h3 class="text-center">Ciudad inteligente y sustentable</h3> </div> <div class="col-sm-3 c-option c-option-short c-color-convivencia" data-slug="convivencia"> <h3 class="text-center">Convivencia</h3> </div> <div class="col-sm-3 c-option c-option-short c-color-movilidad" data-slug="movilidad"> <h3 class="text-center">Hábitat y movilidad</h3> </div> <div class="col-sm-3 c-option c-color-social" data-slug="social"> <h3 class="text-center">Protección e integración social</h3> </div> </div> <div class="row hidden-desktop"> <div class="col-xs-3 c-option c-color-smart"></div> <div class="col-xs-3 c-option c-color-convivencia"></div> <div class="col-xs-3 c-option c-color-movilidad"></div> <div class="col-xs-3 c-option c-color-social"></div> </div> <div class="row hidden-desktop select-container"> <div class="col-xs-12"> <select ng-change="onChangeCategory()" ng-model="selectedCategory" class="form-control"> <option value="">Elegir categoría</option> <option value="smart">Ciudad inteligente y sustentable</option> <option value="convivencia">Convivencia</option> <option value="movilidad">Hábitat y movilidad</option> <option value="social">Protección e integración social</option> </select> </div> <hr> <div class="col-xs-12"> <select ng-change="onChangeGroup()" ng-model="selectedGroup" class="form-control"> <option value="home">Ordenar por nombre</option> <option value="date">Ordenar por fecha fin</option> <option value="state">Ordenar por estado</option> <option value="category">Ordenar por categoría</option> </select> </div> </div> <hr> <div class="row"> <div class="col-sm-3 hidden-device" ng-class="{\'display\':(selectedGroup==\'home\')}"> <a class="group-btn" ng-click="groupMenu(\'home\')"></a> <p class="btn-checkbox hidden-device" ng-class="{\'selected\':(selectedGroup==\'home\')}">Ordenar por nombre</p> <div id="home_chart"> <p class="text-center" ng-cloak ng-show="loading">Cargando...</p> </div> <small class="text-center">Vista general de los compromisos</small> </div> <div class="col-sm-3 hidden-device" ng-class="{\'display\':(selectedGroup==\'date\')}"> <a class="group-btn" ng-click="groupMenu(\'date\')"></a> <p class="btn-checkbox hidden-device" ng-class="{\'selected\':(selectedGroup==\'date\')}">Ordenar por fecha de fin</p> <div id="date_chart"> <p class="text-center" ng-cloak ng-show="loading">Cargando...</p> </div> <small class="text-center">Cantidad de compromisos por año de finalización</small> </div> <div class="col-sm-3 hidden-device" ng-class="{\'display\':(selectedGroup==\'state\')}"> <a class="group-btn" ng-click="groupMenu(\'state\')"></a> <p class="btn-checkbox hidden-device" ng-class="{\'selected\':(selectedGroup==\'state\')}">Ordenar por estado</p> <div id="state_chart" ng-click="groupMenu(\'state\')"> <p class="text-center" ng-cloak ng-show="loading">Cargando...</p> </div> <small class="text-center">Cantidad de compromisos por estado de progreso</small> </div> <div class="col-sm-3 hidden-device" ng-class="{\'display\':(selectedGroup==\'category\')}"> <a class="group-btn" ng-click="groupMenu(\'category\')"></a> <p class="btn-checkbox hidden-device" ng-class="{\'selected\':(selectedGroup==\'category\')}">Ordenar por categoría</p> <div id="category_chart" ng-click="groupMenu(\'category\')"> <p class="text-center" ng-cloak ng-show="loading">Cargando...</p> </div> <small class="text-center">Cantidad de compromisos por categoría de pertenencia</small> </div> </div> <hr> <p class="text-center" ng-show="loading">Cargando...</p> <div ng-cloak ng-hide="loading"> <div class="row"> <div id="menu_chart"></div> </div> <hr> <div id="compromiso-detail" class="row well" ng-cloak ng-show="currentCompromise"> <a class="hidden-desktop" ng-click="closeDetail()">Cerrar</a> <div class="col-sm-3"> <img ng-src="{{currentCompromise.imagen}}"> </div> <div class="col-sm-6"> <h2><small>{{currentCompromise.categoria}}</small></h2> <h2>{{currentCompromise.numero}}.{{currentCompromise.titulo}}</h2> <h5>{{currentCompromise.cumplimiento}}</h5> <p> {{currentCompromise.desc}}</p> <button type="button" class="btn btn-xs upper bg-color-{{currentCompromise.slug}}">Ver mas sobre el compromiso </button> </div> <div class="col-sm-3"> <p class="upper"><strong>Estado del Compromiso</strong></p> <p> Como lo medimos:<strong>Lorem</strong> </p> <p> Tiempo Faltante:<strong>xx meses y xx dias </strong> </p> <div class="progress"> <div class="progress-bar bg-color-{{currentCompromise.slug}}" role="progressbar" ng-style="{ \'width\': currentCompromise.porcentaje_completado + \'%\' }"> <span class="progressbar-w" ng-hide="currentCompromise.porcentaje_completado<50">{{currentCompromise.porcentaje_completado}}% </span> </div> <div class="progress-w" ng-show="currentCompromise.porcentaje_completado<50" ng-style="{ \'width\': (100 - currentCompromise.porcentaje_completado) + \'%\' }">{{currentCompromise.porcentaje_completado}}% </div> </div> <p>Finalizacion:<strong> {{currentCompromise.FechaFinalizacion}} </strong> </p> <a class="hidden-desktop" ng-click="closeDetail()">Cerrar</a> </div> </div> <div id="filler" class="hidden-desktop"></div> </div> <hr>'),a.put("views/includes/detail.html",'<div id="compromiso-interna" class="row c-color-{{currentCompromise.slug}} categoria-{{currentCompromise.slug}}"> <div id="icon-svg-container" class="col-sm-1 col-xs-3 compromiso-icon"> </div> <div class="col-sm-3 col-xs-9"> <p><span class="label-header">Categoría:</span></p> <h4 class="f-color-{{currentCompromise.slug}}">{{currentCompromise.categoria}}</h4> </div> <div class="col-sm-4"> <p><span class="label-header">Cumplimiento:</span></p> <div class="progress"> <div class="progress-bar bg-color-{{currentCompromise.slug}}" role="progressbar" ng-style="{ \'width\': currentCompromise.porcentaje_completado + \'%\' }"> <span class="progressbar-w" ng-hide="currentCompromise.porcentaje_completado<50">{{currentCompromise.porcentaje_completado}}% </span> </div> <div class="progress-w" ng-show="currentCompromise.porcentaje_completado<50" ng-style="{ \'width\': (100 - currentCompromise.porcentaje_completado) + \'%\' }">{{currentCompromise.porcentaje_completado}}% </div> </div> </div> <div class="col-sm-4"> <p><span class="label-header">Categoría:</span>xx meses y xx días.</p> <p><span class="label-header">Finalizacion:</span>{{currentCompromise.cumplimiento}}</p> </div> </div>')}]);