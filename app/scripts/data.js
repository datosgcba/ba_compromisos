function getFile ($sce, $q, $http, url) {
  "use strict";
  var deferred = $q.defer();
  var data;

  var onSuccess = function (result) {
    data = Papa.parse(result.data, { header:true, skipEmptyLines: true }).data;
    deferred.resolve(data);
  };

  var onError = function(error) {
    data = error;
    deferred.reject(error);
  };

  $http.get(url).then(onSuccess, onError);

  return deferred.promise;
}

function loadData ($sce, $q, $http) {
  "use strict";
  var dataPromise = getFile($sce, $q, $http, 'data.csv');
  return $q.when(dataPromise).then(function (data) {
    var mapPromise = getFile($sce, $q, $http, 'mapa.csv');
    return $q.when(mapPromise).then(function (mapa) {
      mapa.map(function(point) {
        point.latitude = parseFloat(point.latitude);
        point.longitude = parseFloat(point.longitude);
      });
      return { data: data, mapa: mapa };
    });
  });
}
