angular.module("treeCtrl", [])
    .constant('_', window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .controller("treeController", ["$scope", "$timeout", "hotkeys", "treeServices", "navigate", function ($scope, $timeout, hotkeys, treeServices, navigate) {

        // set the top node of the tree
        $scope.setTopic = function () {
            treeServices.init(this.topic);
            $scope.node.head = this.topic;
        };

        // add topic branches to the tree
        $scope.insertTopic = function () {
            treeServices.push(this.children);
        };

        // bind the tree to the view
        $scope.$watch(function () {
            if ($scope.chart) {
                $scope.chart.destroy();
            }
            $scope.chart_config = treeServices.tree();
            $scope.chart = new Treant($scope.chart_config);
        });

        // keep track of tree navigation
        $scope.node = {
            head: null,
            depth: 0,
            there: false,
            current: ["text", "name"],
            next: []
        };

        // go down one node
        hotkeys.add({
            combo: 'shift+down',
            callback: function() {

                if ($scope.node.depth > 0) {
                    $scope.node.there = false;
                }

                // go down the node by one level, so that it navigates to the first children in the node
                $scope.node.depth = 0;

                var target = $scope.chart_config.nodeStructure;

                // push "children", 0 to the current node array
                $scope.node.current.splice($scope.node.current.length-2, 0, "children", $scope.node.depth);

                // generate a new array to check if the next node exists
                // copy the current node array
                var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                // add one more "children", 0 to the array
                nextSrc.splice(nextSrc.length-2, 0, "children", $scope.node.depth);
                $scope.node.next = nextSrc;

                // if the next node does not exist, reset the current and next nodes to the previous values
                if ($scope.node.there) {
                    $scope.node.current.splice($scope.node.current.length-4, 2);
                    $scope.node.next.splice($scope.node.current.next-4, 2);
                // if the next nodes exists, update the value to true
                } else if (!_.has(target, $scope.node.next)) {
                    $scope.node.there = true;
                }

                // update the view
                $scope.node.head = _.get(target, $scope.node.current);

                console.log($scope.node.current);
                console.log($scope.node.next);

            }
        });

        hotkeys.add({
            combo: 'shift+up',
            callback: function() {

                $scope.node.depth = 0;

                var target = $scope.chart_config.nodeStructure;

                if ($scope.node.current.length > 2) {
                    $scope.node.current.splice($scope.node.current.length-4, 2);
                    if ($scope.node.next.length > 2) {
                        var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                        nextSrc.splice(nextSrc.length-4, 2);
                        $scope.node.next = nextSrc;
                    }
                }

                if (_.has(target, $scope.node.next)) {
                    $scope.node.there = false;
                }

                $scope.node.head = _.get(target, $scope.node.current);

                console.log($scope.node.current);
                console.log($scope.node.next);
            }
        });

        hotkeys.add({
            combo: 'shift+right',
            callback: function() {

                var target = $scope.chart_config.nodeStructure;

                if ($scope.node.current.length >= 4) {
                    if ($scope.node.depth == 0) {
                        console.log("POWER");
                        $scope.node.there = false;
                    }
                    $scope.node.depth++;
                    $scope.node.current.splice($scope.node.current.length-3, 1, $scope.node.depth);

                    var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                    nextSrc.splice(nextSrc.length-3, 1, $scope.node.depth+1);
                    $scope.node.next = nextSrc;

                    if ($scope.node.there) {
                        $scope.node.depth--;
                        $scope.node.current.splice($scope.node.current.length-3, 1, $scope.node.depth);
                        $scope.node.next.splice($scope.node.next.length-3, 1, $scope.node.depth+1);
                        console.log("THERE");
                        console.log($scope.node.current);
                        console.log($scope.node.next);
                    }

                    if (!_.has(target, $scope.node.next)) {
                        $scope.node.there = true;
                    }

                    $scope.node.head = _.get(target, $scope.node.current);

                    console.log($scope.node.current);
                    console.log($scope.node.next);
                }
            }
        });
        hotkeys.add({
            combo: 'shift+left',
            callback: function() {

                var target = $scope.chart_config.nodeStructure;

                $scope.node.depth--;
                if ($scope.node.depth >= 0) {
                    $scope.node.current.splice($scope.node.current.length-3, 1, $scope.node.depth);
                    var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                    if ($scope.node.depth == 0) {
                        nextSrc.splice(nextSrc.length-3, 1, $scope.node.depth);
                    } else {
                        nextSrc.splice(nextSrc.length-3, 1, $scope.node.depth-1);
                    }

                    $scope.node.next = nextSrc;
                }

                if (_.has(target, $scope.node.next)) {
                    $scope.node.there = false;
                }

                $scope.node.head = _.get(target, $scope.node.current);

                console.log($scope.node.current);
                console.log($scope.node.next);
            }
        });

    }]);