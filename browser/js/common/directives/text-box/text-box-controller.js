app.controller('TextBoxController', function($scope, MessageFactory){
    
    $scope.collection = {};
    
    $scope.collectMessage = function(collection){
        console.log('WORKS')
        MessageFactory.saveMessage(collection)
        .then(e => console.log("ANYTHING?",e))
    };
    
});