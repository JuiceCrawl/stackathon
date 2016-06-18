app.directive('textBox', function () {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/text-box/text-box.html',
        controller: 'TextBoxController'
    };

});

// app.config(function($stateProvider){
//   $stateProvider.state('home.update',{
//     url: '/update',
//     templateUrl: 'js/common/directives/text-box/text-box.html',
//     controller: 'TextBoxController'
//   });
// });