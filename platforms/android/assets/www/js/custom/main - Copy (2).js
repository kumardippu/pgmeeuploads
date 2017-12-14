    // create the module and name it pgmee
    // also include ngRoute for all our routing needs
    //var pgmee = angular.module('pgmee', ['ngRoute','ngSanitize','ionic.cloud']);
    var pgmee = angular.module('pgmee', ['ngRoute','ngSanitize']);
    //Routing defined at route.js , Service called from service.js and Factory called from factory.js


/*pgmee.run(function($location,sessionService) {
  userid = sessionService.get('userid');
        if(userid>0){
              $location.path('/login');  
        }else{
            //$location.path('/login');
        }
});*/


// This will check user is login or not on every event
pgmee.run(function ($rootScope,$location,sessionService) {
    $rootScope.$on('$routeChangeStart', function (event) {
        userid = sessionService.get('userid');
        if( !(userid>0) ){
            $location.path('/login');
        }
        
    });
});
    // create the controller and inject Angular's $scope
    pgmee.controller('mainController', function($scope,$location,menu,queryFactory,sessionService) {
        $scope.data = '';
       //sessionService.set('testpg','dippu');
       //alert(sessionService.get('testpg'));
       //sessionService.destroy('test');
       //sessionService.destroyAll();
       
        // Get Menu using Service from service.js       
        menu.getMenu().async().then(function(d) {
            $scope.menu = d.data;
       }); 
        // create a message to display in our view
        $scope.message = 'Everyone come and see how good I look!';
    });
    
    
    pgmee.controller('logoutController', function($scope,sessionService) {
        
        sessionService.destroyAll();
    });
    
    pgmee.controller('loginController', function($scope,$http,$location,queryFactory,sessionService) {
        var apiUrl = "http://pgmeeuploads.com/question_api/";
        $scope.uname = '';
        $scope.pwd = '';
token = sessionService.get('dippuToken');
//alert(token);        
        $scope.login = function(uname,pwd){
             if(uname!='' && pwd!=''){
                  var postData = {uname : uname,pwd : pwd,loginApp : true};	
                     //qar = {catID:catID,qid:qid,correctOptStr:correctOptStr,userAns:showValue,correctOption:correctOption};
            
                    submit_url = apiUrl+"login/?param="+JSON.stringify(postData);
                    queryFactory.getResult(submit_url).success(function(response){
                    console.log(response);    
                        if(response.status=='success'){                    
                            $scope.user = response.data;
                            //console.log(response.data.uid);
                            sessionService.destroyAll();
                            sessionService.set('userid',response.data.uid);
                            sessionService.set('username',response.data.uname);
                            sessionService.set('dippuToken',response.data.appToken);
                            $scope.error = false;

                            /*$ionicPush.register().then(function(t) {
                              console.log(t);
                              return $ionicPush.saveToken(t);
                            }).then(function(t) {
                              console.log('Token saved:', t.token);
                            });*/

                            $location.path('/');
                        }else{                        
                            $scope.error = true;
                            $scope.error_msg = response.msg;
                        }                
                    }).error(function(){
                        console.log("server error");
                        $scope.error = true;
                        $scope.error_msg = 'There are some server error';
                    });
            }else{
                $scope.error = true;
                $scope.error_msg = 'Fields can not be blank';
            }
        }
    });
   
    pgmee.controller('qbankController', function($scope,$http,$location,$routeParams,queryFactory,sessionService) {
        $scope.show = false;
        $scope.qod = false;
            
        $scope.param1 = "";
        var apiUrl = "http://pgmeeuploads.com/question_api/";
        var baseUrl = "http://pgmeeuploads.com/question_api/qbnk/";
        var catID = $routeParams.catid;//'200';
        var url = baseUrl+catID+"/0";
        var correctOption = '';
        $scope.question_no = 0;
        var qid = 0;
        
        
        userid = sessionService.get('userid');
            token = sessionService.get('dippuToken');
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
       
        
        
        $scope.imgLarger = '';
        $scope.imgFlag = 0;
        
        urlExecution(url);
        
        $scope.showExp = function(showValue){
            
            if(showValue>0){
                var correctOptStr='';
                if(showValue==correctOption){
                    correctOptStr= 'Correct';
                }else{
                    correctOptStr= 'Incorrect';     
                }
                uid = sessionService.get('userid');
                qar = {catID:catID,qid:qid,correctOptStr:correctOptStr,userAns:showValue,correctOption:correctOption,uid:uid};
                console.log(qar);
                submit_url = apiUrl+"answerSubmit/answerSubmit/?param="+JSON.stringify(qar);
                queryFactory.getResult(submit_url).success(function(response){
                    if(response.status=='success'){                    
                        $scope.per = response.data;
                        
                        $scope.show = true;
                        $scope.validate = true;    
                    }                
                });
            }else{
                $scope.validate = false;
            }
        }
        $scope.nextQuestion = function(quesNo,qcount){
            $scope.question_no = quesNo;
            $scope.imgLarger = '';
            $scope.show = false;
            if(quesNo>=qcount || quesNo < 0){
                url = baseUrl+catID+"/0";
                $scope.question_no = 0;    
            }else{
                url = baseUrl+catID+"/"+$scope.question_no;
            }
            urlExecution(url);
        }
        $scope.prevQuestion = function(quesNo,qcount){
            $scope.question_no = quesNo;
            $scope.imgLarger = '';
            $scope.show = false;
            if(quesNo>=qcount || quesNo < 0){
                url = baseUrl+catID+"/0";
                $scope.question_no = 0;    
            }else{
                url = baseUrl+catID+"/"+$scope.question_no;
            }
            urlExecution(url);
        }
        
        $scope.imgEnlarger = function(imgFlag){
            if(imgFlag==0){
                $scope.imgLarger = "img-larger";
                $scope.imgFlag = 1;
            }else{                
                $scope.imgLarger = "";
                $scope.imgFlag = 0;
            }
        }
             
      function urlExecution(url){ 
            //Calling from factory.js
            queryFactory.getResult(url).success(function(response){
                if(response.status=='success'){                
                    $scope.ques = response.data;
                    correctOption = $scope.ques.ans;
                    qid = $scope.ques.id;
                    $scope.qcount = response.data.qcount;
                    
                    $scope.error = false;    
                }else{
                    $scope.error_msg = response.msg;
                    $scope.error = true;
                }
            }).error(function(){
                console.log("server error");
                $scope.error_msg = 'There are some server error';
                $scope.error = true;
        })
     }
        $scope.message = 'This is testing for the Quiz';
    });

    pgmee.controller('qodController', function($scope,$http,$location,$routeParams,queryFactory,sessionService) {
        $scope.show = false;
        $scope.qod = true;    
        $scope.param1 = "";
        var apiUrl = "http://pgmeeuploads.com/question_api/";
        var baseUrl = "http://pgmeeuploads.com/question_api/qod/";
        var qtype = $routeParams.qtype;//'200';
        var url = baseUrl+qtype;
        
        userid = sessionService.get('userid');
        token = sessionService.get('dippuToken');
         var tokenData = {uid : userid,loginApp : true};
                token_url = apiUrl+"tokenValidator/?param="+JSON.stringify(tokenData);
                queryFactory.getResult(token_url).success(function(response){
                      console.log(response);
                        if(response.status=='success'){    
                            console.log("lo "+token+" server "+response.data.token)                    
                            if(response.data.token != token){
                                alert('Multiple device login not allowed');
                                $location.path('/login');           
                            }
                        }                
                });  
        $scope.imgLarger = '';
        $scope.imgFlag = 0;
        
        urlExecution(url);
        
        $scope.showExp = function(showValue){
            
            if(showValue>0){
                var correctOptStr='';
                if(showValue==correctOption){
                    correctOptStr= 'Correct';
                }else{
                    correctOptStr= 'Incorrect';     
                }
                $scope.show = true;
                $scope.validate = true;    
            }else{
                $scope.validate = false;
            }
        }
        
        $scope.imgEnlarger = function(imgFlag){
            if(imgFlag==0){
                $scope.imgLarger = "img-larger";
                $scope.imgFlag = 1;
            }else{                
                $scope.imgLarger = "";
                $scope.imgFlag = 0;
            }
        }
             
      function urlExecution(url){ 
            //Calling from factory.js
            queryFactory.getResult(url).success(function(response){
                if(response.status=='success'){                
                    $scope.ques = response.data;
                    correctOption = $scope.ques.ans;
                    qid = $scope.ques.id;
                    $scope.qcount = response.data.qcount;
                    
                    $scope.error = false;    
                }else{
                    $scope.error_msg = response.msg;
                    $scope.error = true;
                }
            }).error(function(){
                console.log("server error");
                $scope.error_msg = 'There are some server error';
                $scope.error = true;
        })
     }
        $scope.message = 'This is testing for the Quiz';
    });
    
    
   /*pgmee.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});*/ 