 // configure our routes
 //pgmee defined at main.js
    pgmee.config(['$routeProvider',function($routeProvider) {
        $routeProvider
            // route for the home page
            .when('/', {
                templateUrl : 'pages/home.html',
                controller  : 'mainController'
            })

            .when('/login', {
                templateUrl : 'pages/login.html',
                controller  : 'loginController'
            })
            .when('/logout', {
                templateUrl : 'pages/login.html',
                controller  : 'logoutController'
            })
            // route for the about page
            /*.when('/about', {
                templateUrl : 'pages/about.html',
                controller  : 'aboutController'
            })

            // route for the contact page
            .when('/quiz', {
                templateUrl : 'pages/contact.html',
                controller  : 'quizController'
            })
           */
            // route for the contact page
            .when('/qbank/:catid/', {
                templateUrl : 'pages/qbank.html',
                controller  : 'qbankController'
            })
            .when('/qod/:qtype/', {
                templateUrl : 'pages/qbank.html',
                controller  : 'qodController'
            })
            
            .otherwise({redirectTo : '/'});
            /*.when('/contact', {
                templateUrl : 'pages/contact.html',
                controller  : 'contactController'
            });*/
    }]);