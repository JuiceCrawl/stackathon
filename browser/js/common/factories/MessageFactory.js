app.factory('MessageFactory', function ($http) {
  return {
    saveMessage: function(collection){
      return $http.post('api/store', collection)
      .then(e => console.log("AG?",e))
    },
    sent: false
  }
});