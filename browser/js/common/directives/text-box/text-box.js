app.directive('textBox', function (RandomGreetings) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/text-box/text-box.html',
        controller: 'TextBoxController'
    };

});