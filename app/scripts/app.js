"use strict";
$.urlParam = function(url, name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(url);
  if (results === null) {
    return null;
  } else {
    return results[1] || 0;
  }
};

window.mobileAndTabletcheck = function() {
  var check = false;
  (function(a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};
var usig = usig || {};
usig.App = usig.App || {};

usig.App.config = {
  server_url: "//epok.buenosaires.gob.ar/",
  symbols_url: "//static.mapa.buenosaires.gob.ar/symbols/",
  backgrounds_url: "//static.mapa.buenosaires.gob.ar/images/markers/fondos/",
  baseLayer: "mapabsas_informacion_basica",
  initBounds: [85000, 96750, 112000, 106750],
  pointRadius: 18,
  minPointRadius: 11,
  inverseIcons: [8, 9, 11, 12, 13, 15]
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
  .module("compromisosSiteApp", [
    "ngRoute",
    "duScroll",
    "ngSanitize",
    "ngYoutubeEmbed",
    "hljs"
  ])
  .config(function($routeProvider) {
    $routeProvider
      .when("/home", {
        templateUrl: "views/home.html",
        controller: "HomeCtrl",
        controllerAs: "home"
      })
      .when("/map", {
        templateUrl: "views/map.html",
        controller: "HomeCtrl",
        controllerAs: "home"
      })
      .when("/c01", {
        templateUrl: "views/c01.html",
        controller: "Compromiso01Ctrl",
        controllerAs: "c01"
      })
      .when("/c02", {
        templateUrl: "views/c02.html",
        controller: "Compromiso02Ctrl",
        controllerAs: "c02"
      })
      .when("/c03", {
        templateUrl: "views/c03.html",
        controller: "Compromiso03Ctrl",
        controllerAs: "c03"
      })
      .when("/c04", {
        templateUrl: "views/c04.html",
        controller: "Compromiso04Ctrl",
        controllerAs: "c04"
      })
      .when("/c05", {
        templateUrl: "views/c05.html",
        controller: "Compromiso05Ctrl",
        controllerAs: "c05"
      })
      .when("/c06", {
        templateUrl: "views/c06.html",
        controller: "Compromiso06Ctrl",
        controllerAs: "c06"
      })
      .when("/c07", {
        templateUrl: "views/c07.html",
        controller: "Compromiso07Ctrl",
        controllerAs: "c07"
      })
      .when("/c08", {
        templateUrl: "views/c08.html",
        controller: "Compromiso08Ctrl",
        controllerAs: "c08"
      })
      .when("/c09", {
        templateUrl: "views/c09.html",
        controller: "Compromiso09Ctrl",
        controllerAs: "c09"
      })
      .when("/c10", {
        templateUrl: "views/c10.html",
        controller: "Compromiso10Ctrl",
        controllerAs: "c10"
      })
      .when("/c11", {
        templateUrl: "views/c11.html",
        controller: "Compromiso11Ctrl",
        controllerAs: "c11"
      })
      .when("/c12", {
        templateUrl: "views/c12.html",
        controller: "Compromiso12Ctrl",
        controllerAs: "c12"
      })
      .when("/c13", {
        templateUrl: "views/c13.html",
        controller: "Compromiso13Ctrl",
        controllerAs: "c13"
      })
      .when("/c14", {
        templateUrl: "views/c14.html",
        controller: "Compromiso14Ctrl",
        controllerAs: "c14"
      })
      .when("/c15", {
        templateUrl: "views/c15.html",
        controller: "Compromiso15Ctrl",
        controllerAs: "c15"
      })
      .when("/c16", {
        templateUrl: "views/c16.html",
        controller: "Compromiso16Ctrl",
        controllerAs: "c16"
      })
      .when("/c17", {
        templateUrl: "views/c17.html",
        controller: "Compromiso17Ctrl",
        controllerAs: "c17"
      })
      .when("/c18", {
        templateUrl: "views/c18.html",
        controller: "Compromiso18Ctrl",
        controllerAs: "c18"
      })
      .when("/c19", {
        templateUrl: "views/c19.html",
        controller: "Compromiso19Ctrl",
        controllerAs: "c19"
      })
      .when("/c20", {
        templateUrl: "views/c20.html",
        controller: "Compromiso20Ctrl",
        controllerAs: "c20"
      })
      .when("/c21", {
        templateUrl: "views/c21.html",
        controller: "Compromiso21Ctrl",
        controllerAs: "c21"
      })
      .when("/c22", {
        templateUrl: "views/c22.html",
        controller: "Compromiso22Ctrl",
        controllerAs: "c22"
      })
      .when("/c23", {
        templateUrl: "views/c23.html",
        controller: "Compromiso23Ctrl",
        controllerAs: "c23"
      })
      .when("/c24", {
        templateUrl: "views/c24.html",
        controller: "Compromiso24Ctrl",
        controllerAs: "c24"
      })
      .when("/c25", {
        templateUrl: "views/c25.html",
        controller: "Compromiso25Ctrl",
        controllerAs: "c25"
      })
      .when("/c26", {
        templateUrl: "views/c26.html",
        controller: "Compromiso26Ctrl",
        controllerAs: "c26"
      })
      .when("/c27", {
        templateUrl: "views/c27.html",
        controller: "Compromiso27Ctrl",
        controllerAs: "c27"
      })
      .when("/c28", {
        templateUrl: "views/c28.html",
        controller: "Compromiso28Ctrl",
        controllerAs: "c28"
      })
      .when("/c29", {
        templateUrl: "views/c29.html",
        controller: "Compromiso29Ctrl",
        controllerAs: "c29"
      })
      .when("/c30", {
        templateUrl: "views/c30.html",
        controller: "Compromiso30Ctrl",
        controllerAs: "c30"
      })
      .when("/c31", {
        templateUrl: "views/c31.html",
        controller: "Compromiso31Ctrl",
        controllerAs: "c31"
      })
      .when("/c32", {
        templateUrl: "views/c32.html",
        controller: "Compromiso32Ctrl",
        controllerAs: "c32"
      })
      .when("/c33", {
        templateUrl: "views/c33.html",
        controller: "Compromiso33Ctrl",
        controllerAs: "c33"
      })
      .when("/c34", {
        templateUrl: "views/c34.html",
        controller: "Compromiso34Ctrl",
        controllerAs: "c34"
      })
      .when("/c35", {
        templateUrl: "views/c35.html",
        controller: "Compromiso35Ctrl",
        controllerAs: "c35"
      })
      .when("/c36", {
        templateUrl: "views/c36.html",
        controller: "Compromiso36Ctrl",
        controllerAs: "c36"
      })
      .when("/c37", {
        templateUrl: "views/c37.html",
        controller: "Compromiso37Ctrl",
        controllerAs: "c37"
      })
      .when("/c38", {
        templateUrl: "views/c38.html",
        controller: "Compromiso38Ctrl",
        controllerAs: "c38"
      })
      .when("/c39", {
        templateUrl: "views/c39.html",
        controller: "Compromiso39Ctrl",
        controllerAs: "c39"
      })
      .when("/c40", {
        templateUrl: "views/c40.html",
        controller: "Compromiso40Ctrl",
        controllerAs: "c40"
      })
      .when("/c41", {
        templateUrl: "views/c41.html",
        controller: "Compromiso41Ctrl",
        controllerAs: "c41"
      })
      .when("/c42", {
        templateUrl: "views/c42.html",
        controller: "Compromiso42Ctrl",
        controllerAs: "c42"
      })
      .when("/c43", {
        templateUrl: "views/c43.html",
        controller: "Compromiso43Ctrl",
        controllerAs: "c43"
      })
      .when("/c44", {
        templateUrl: "views/c44.html",
        controller: "Compromiso44Ctrl",
        controllerAs: "c44"
      })
      .when("/c45", {
        templateUrl: "views/c45.html",
        controller: "Compromiso45Ctrl",
        controllerAs: "c45"
      })
      .when("/c46", {
        templateUrl: "views/c46.html",
        controller: "Compromiso46Ctrl",
        controllerAs: "c46"
      })
      .when("/c47", {
        templateUrl: "views/c47.html",
        controller: "Compromiso47Ctrl",
        controllerAs: "c47"
      })
      .when("/c48", {
        templateUrl: "views/c48.html",
        controller: "Compromiso48Ctrl",
        controllerAs: "c48"
      })
      .when("/c49", {
        templateUrl: "views/c49.html",
        controller: "Compromiso49Ctrl",
        controllerAs: "c49"
      })
      .when("/c50", {
        templateUrl: "views/c50.html",
        controller: "Compromiso50Ctrl",
        controllerAs: "c50"
      })
      .when("/c51", {
        templateUrl: "views/c51.html",
        controller: "Compromiso51Ctrl",
        controllerAs: "c51"
      })
      .when("/c52", {
        templateUrl: "views/c52.html",
        controller: "Compromiso52Ctrl",
        controllerAs: "c52"
      })
      .when("/c53", {
        templateUrl: "views/c53.html",
        controller: "Compromiso53Ctrl",
        controllerAs: "c53"
      })
      .when("/c54", {
        templateUrl: "views/c54.html",
        controller: "Compromiso54Ctrl",
        controllerAs: "c54"
      })
      .when("/ilustraciones/:name", {
        templateUrl: "views/ilustraciones.html",
        controller: "IlustracionesCtrl",
        controllerAs: "ilustraciones"
      })
      .otherwise({
        redirectTo: "/"
      });
  })
  .service("SlugColorService", function() {
    this.colorsBySlug = {
      social: "#c15180",
      disfrute: "#3abaaf",
      humana: "#f58b45",
      creatividad: "#7c4194"
    };

    this.getColorBySlug = function(slug) {
      if (slug) {
        return this.colorsBySlug[slug.toLowerCase()];
      } else {
        return this.colorsBySlug;
      }
    };
  })
  .service("LoadSVGService", function() {
    this.loadIcon = function(name, cb) {
      name = name.length == 1 ? "0" + name : name;
      var icon = "images/iconos_v2/GCBA-compromisos-icons-" + name + ".svg";
      d3.xml(icon, "image/svg+xml", function(error, xml) {
        cb(document.importNode(xml.documentElement, true));
      });
    };
  })
  .service("GetSVGNameService", function() {
    this.getUrl = function(name, param) {
      if (param) {
        name = name.length == 1 ? "0" + name : name;
        var icon = "images/iconos_v2/GCBA-compromisos-icons-cumplido.svg";
        return icon;
      } else {
        name = name.length == 1 ? "0" + name : name;
        var icon = "images/iconos_v2/GCBA-compromisos-icons-" + name + ".svg";
        return icon;
      }
    };
  })
  .service("UrlService", function() {
    if (!window.COMPROMISOS_CONFIG) {
      console.error(
        "Archivo de configuración inexistente, utilizando configuración default de desarrollo."
      );
      window.COMPROMISOS_CONFIG = {
        BASE_URL: "https://csv-to-api-compromisos.herokuapp.com/",
        HOME_CSV: "https://goo.gl/w0wnOj",
        OBRAS_CSV: "https://goo.gl/YF8r9Y",
        ILUSTRACIONES_CSV: "https://goo.gl/fU5jee"
        /*HOME_CSV: 'https://goo.gl/Nj6FZm'*/
        /*
          BASE_URL: 'https://compromisos-csv.buenosaires.gob.ar',
          HOME_CSV: 'http://recursos-data.buenosaires.gob.ar/ckan2/compromisos/master_compromisos.csv'
          */
      };
    }
    this.baseUrl = window.COMPROMISOS_CONFIG.BASE_URL;
    this.urls = {
      home:
        this.baseUrl +
        "?source_format=csv&source=" +
        window.COMPROMISOS_CONFIG.HOME_CSV,
      obras:
        this.baseUrl +
        "?source_format=csv&source=" +
        window.COMPROMISOS_CONFIG.OBRAS_CSV,
      ilustraciones:
        this.baseUrl +
        "?source_format=csv&source=" +
        window.COMPROMISOS_CONFIG.ILUSTRACIONES_CSV
    };
    this.getUrlByPage = function(page) {
      return this.urls[page] + "&callback=JSON_CALLBACK";
    };
    this.getUrlByCsv = function(csv) {
      return (
        this.baseUrl +
        "?source_format=csv&source=" +
        csv +
        "&callback=JSON_CALLBACK"
      );
    };
  })
  .run(function($rootScope, $interval) {
    // Definicion del namespace

    proj4.defs(
      "EPSG:221951",
      "+proj=tmerc +lat_0=-34.6297166 +lon_0=-58.4627 +k=0.9999980000000001 +x_0=100000 +y_0=100000 +ellps=intl +towgs84=-148,136,90,0,0,0,0 +units=m +no_defs"
    );

    //Locale!
    var es_ES = {
      decimal: ",",
      thousands: ".",
      grouping: [3],
      currency: ["€", ""],
      dateTime: "%a %b %e %X %Y",
      date: "%d/%m/%Y",
      time: "%H:%M:%S",
      periods: ["AM", "PM"],
      days: [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
      ],
      shortDays: ["Dom", "Lun", "Mar", "Mi", "Jue", "Vie", "Sab"],
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre"
      ],
      shortMonths: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic"
      ]
    };

    $rootScope.d3Locale_ES = d3.locale(es_ES);

    // instance-injector
    var intervalID,
      max = 350,
      coincidence = 0;
    var updateFrame = function() {
      $interval.cancel(intervalID);
      intervalID = $interval(function() {
        //console.log('lanza!');
        $(".detalle-frame")
          .not(".ignore-adjust")
          .each(function(i, e) {
            $(e).css("height", "auto");
            var h = $(e).outerHeight();
            if (h > max) {
              max = h;
            }
            //console.log(i,h,max);
          });
        $(".detalle-frame")
          .not(".ignore-adjust")
          .css("height", max + "px");
      }, 2000);
    };

    function adjust() {
      updateFrame();

      setTimeout(function() {
        $interval.cancel(intervalID);
      }, 10000);
    }

    setTimeout(function() {
      adjust();
    }, 2000);

    var id;
    $(window).resize(function() {
      clearTimeout(id);
      id = setTimeout(function() {
        adjust();
      }, 500);
    });
  });
