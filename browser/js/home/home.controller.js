app.controller('HomeCtrl', function ($scope, CohortFactory, MessageFactory) {

  $scope.sent = MessageFactory.sent;
  console.log('$scope.sent',$scope.sent)
   

});