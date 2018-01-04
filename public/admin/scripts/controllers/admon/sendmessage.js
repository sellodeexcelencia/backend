angular.module('dmt-back').controller('sendMessageController', function ($mdDialog, $scope, user, entity, $q, $http) {
  var ctrl = this;
  ctrl.user = user;
  ctrl.entity = entity
  ctrl.message = `
  <div style="text-align:center;margin: 10px auto;">
  <img width="100" src="http://sellodeexcelencia.gov.co/assets/img/sell_gel.png"/>
  </div>
  <div>
  <p> Hola ${ctrl.user.name} </p>
  <br>
  <br>
  <p>Nuestros mejores deseos,</p>

  <p>El equipo del Sello de Excelencia</p>`
  ctrl.cancel = $mdDialog.cancel;
  function onComplete() {
    
  }
  function error(err) {
    
  }

  this.send = function () {
    $http.post(
      '/api/configuration/send',
      {id:ctrl.user.id,entity:ctrl.entity,message:ctrl.message}).then(function(){
      ctrl.result = true
    })
  }
});