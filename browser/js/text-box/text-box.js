app.controller('TextBoxController', function($scope, $state, MessageFactory, cohort){
    
    $scope.collection = {};

    $scope.cohort = cohort;
    console.log('$scope.cohort',$scope.cohort)
    
    $scope.collectMessage = function(collection){
        MessageFactory.saveMessage(collection)
        .then(function(){
          // $scope.collection.eResponse = '';
          // alert('Thanks for your Response!');
          $state.go('cohort.submitted');
        });
    };
    
});
