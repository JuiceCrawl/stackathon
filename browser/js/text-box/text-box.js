app.controller('TextBoxController', function($scope, $state, MessageFactory, cohort){
    
    $scope.collection = {};

    $scope.cohort = cohort;
    
    $scope.collectMessage = function(collection){
        MessageFactory.saveMessage(collection)
        .then(function(){
          // socket.emit('responded')
          $state.go('cohort.submitted');
        });
    };
    
});
