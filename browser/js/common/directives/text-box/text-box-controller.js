app.controller('TextBoxController', function($scope, MessageFactory){
    
    $scope.collection = {};
    
    $scope.collectMessage = function(collection){
        MessageFactory.saveMessage(collection)
        .then(function(){
          $scope.collection.eResponse = '';
          alert('Thanks for your Response!');
        });
    };
    
});
