app.factory('AdminFactory', function ($http) {
  return {
    sendEmails: function(obj){
      return $http.post('/api/send', obj)
      .then(null, function(err){
        console.error(err);
      });
    },
    sendCompilation : function(id){
      return $http.get('/api/messages/' + id)
      .then(null, function(err){
        console.error(err);
      });
    },
    getAllNewsletters : function(){
      return $http.get('/api/newsletters')
      .then(function(newsletters){
        return newsletters.data;
      });
    },
    getAllCohorts : function(){
      return $http.get('/api/cohorts')
      .then(function(cohorts){
        return cohorts.data;
      });
    },
    updateCohorts : function(obj){
      return $http.put('/api/cohorts', obj)
      .then(function(updated){
        return updated.data;
      })
      .then(null, function(err){
        console.error(err);
      });
    },
    createCohorts : function(obj){
      return $http.post('/api/cohorts', obj)
    }
  };
});