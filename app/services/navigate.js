angular.module("navigateTree", [])
    .constant("_", window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .service("navigate", function () {

        this.goDown = function () {
            //
        }

    });