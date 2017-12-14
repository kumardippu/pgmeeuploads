    //Service for Menu
    pgmee.service('menu', function($http,queryFactory) {
        var url = "http://pgmeeuploads.com/question_api/getQuestionBankMenu/117/qb";
        this.getMenu = function () {
            var menuService = {
                async:function(){
                    var promise = queryFactory.getResult(url);
                    promise.then(function(data){                    
                        return data;   
                    });
                    return promise;
                }
            };
            return menuService;
        }
    });
    
    
            /** Check for login more than one devices  **/
       pgmee.service('tokenValidatorService', function($rootScope,$http,$location,queryFactory,sessionService) {
            var apiUrl = "http://pgmeeuploads.com/question_api/";
            userid = sessionService.get('userid');
            token = sessionService.get('dippuToken');
            
            this.isValidToken = function () {        
                var tokenData = {uid : userid,loginApp : true};
                token_url = apiUrl+"tokenValidator/?param="+JSON.stringify(tokenData);
                queryFactory.getResult(token_url).success(function(response){
                      console.log(response);
                        if(response.status=='success'){    
                            console.log("lo "+token+" server "+response.data.token)                    
                            if(response.data.token != token){
                                alert('Multiple device login not allowed');
                                //$rootScope.error=true;
                                //$rootScope.error_msg="Multiple device login not allowed";
                                //sessionService.destroyAll();
                                $location.path('/login');           
                            }
                        }                
                });
            
           } 
                        
    });
        /** Check for login more than one devices  **/
        