angular.module('dmt-back').controller('deleteItemController', function ($mdDialog, $scope, items, entity, $q, $http) {
  var ctrl = this;
  ctrl.currentEntity = entity;
  ctrl.cancel = $mdDialog.cancel;
  ctrl.error = ''
  function removeItems(item, index) {
    var base = ctrl.currentEntity.endpoint;
    var fields = [];
    ctrl.currentEntity.fields.forEach((field) => {
      if (field.key === "true" || field.key === true) {
        if (typeof item === 'object') {
          fields.push(field.name + "=" + item[field.name]);
        } else {
          fields.push(field.name + "=" + item);
        }
      }
    })
    var query = "?" + fields.join("&");
    var promise = $http.delete(base + query);
    promise.then(function () {
      items.splice(index, 1);
    }).catch(() => {
      if (!ctrl.error) {
        $mdDialog.show($mdDialog.alert()
          .parent(angular.element(document.body))
          .clickOutsideToClose(true)
          .title('No se puede borrar')
          .textContent('Uno o más de los elementos seleccionados no pueden ser eliminados verifique que no estén en uso')
          .ariaLabel('No Borrar')
          .ok('OK')
        )
        ctrl.error = true
      }
    });
    return promise;
  }

  function onComplete() {
    $mdDialog.hide();
  }
  function error(err) {
    $mdDialog.hide();
  }

  this.deleteItems = function () {
    $q.all(items.forEach(removeItems)).then(onComplete).catch(error);
  }
});