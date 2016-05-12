angular.module("treeCtrl", [])
    .constant('_', window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .controller("treeController", ["$scope", "hotkeys", "treeServices", function ($scope, hotkeys, treeServices) {

        // set the main topic of the tree
        $scope.setTopic = function () {
            treeServices.init(this.topic);
            $scope.node.head = this.topic;
        };

        // add branches to the tree
        $scope.insertTopic = function () {
            treeServices.push(this.children, $scope.node.insertAt);
        };

        // bind the tree to the view
        $scope.$watch(function () {

            // automatically update the tree
            if ($scope.chart) {
                $scope.chart.destroy();
            }
            $scope.chart_config = treeServices.tree();
            $scope.chart = new Treant($scope.chart_config);

            // update the view when the current topic changes
            $scope.node.head = _.get($scope.chart_config.nodeStructure, $scope.node.current);

            // keep track of the current node to insert a new branch
            if ($scope.node.current.length >= 4) {
                var insertSrc = _.take($scope.node.current, $scope.node.current.length-2);
                insertSrc.push("children");
                $scope.node.insertAt = insertSrc;
            } else {
                $scope.node.insertAt = "children";
            }

            var target = angular.element('.nodeBranches');
            for (var i = 0; i < target.length; i++) {
                var id = target.eq(i).attr("id");
                target.eq(i).attr("ng-class")
            }

            (function () {
                var target = angular.element(".nodeBranches");
                for (var i = 0; i < target.length; i++) {
                    var id = target.eq(i).attr("id");
                    var attr = "changeClass('" + id + "')";
                    target.eq(i).attr("ng-class", attr);
                }
            })();
        });

        $scope.currentNode = "nodeTop";

        $scope.changeClass = function (newValue) {
            return $scope.currentNode == newValue ? "active" : "";
        };

        // keep track of tree navigation
        $scope.node = {
            head: null,
            depth: 0,
            there: false,
            current: ["text", "name"],
            next: ["children", 0, "text", "name"],
            direction: null,
            insertAt: "children"
        };

        function resetDirc (direction) {
            if ($scope.node.direction !== direction) {
                $scope.node.there = false;
                $scope.node.direction = direction;
            }
        }
        function checkNext (trg, src) {
            if (!_.has(trg, src)) {
                $scope.node.there = true;
            }
        }

        // go down one node
        hotkeys.add({
            combo: 'shift+down',
            callback: function() {
                resetDirc("down");

                if ($scope.node.depth > 0) {
                    $scope.node.there = false;
                }
                $scope.node.depth = 0;

                if ($scope.node.current.length == 2) {
                    var test = _.take($scope.node.current, 2);
                    test.splice(0, 0, "children", 0);
                    if (_.has($scope.chart_config.nodeStructure, test)) {
                        $scope.node.current.splice($scope.node.current.length-2, 0, "children", $scope.node.depth);

                        var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                        nextSrc.splice(nextSrc.length-2, 0, "children", $scope.node.depth);
                        $scope.node.next = nextSrc;
                        console.log($scope.node.there);

                        if ($scope.node.there) {
                            $scope.node.current.splice($scope.node.current.length-4, 2);
                            $scope.node.next.splice($scope.node.current.next-4, 2);
                        }

                    }
                } else {
                    console.log("GODOWN");
                    $scope.node.current.splice($scope.node.current.length-2, 0, "children", $scope.node.depth);

                    var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                    nextSrc.splice(nextSrc.length-2, 0, "children", $scope.node.depth);
                    $scope.node.next = nextSrc;
                    console.log($scope.node.there);

                    if ($scope.node.there) {
                        $scope.node.current.splice($scope.node.current.length-4, 2);
                        $scope.node.next.splice($scope.node.current.next-4, 2);
                    }
                }

                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
            }
        });

        hotkeys.add({
            combo: 'shift+up',
            callback: function() {
                resetDirc("up");

                if ($scope.node.current.length > 2) {
                    $scope.node.current.splice($scope.node.current.length-4, 2);
                    if ($scope.node.next.length > 2) {
                        var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                        nextSrc.splice(nextSrc.length-4, 2);
                        $scope.node.next = nextSrc;
                    }
                    $scope.node.depth = $scope.node.current[$scope.node.current.length - 3];
                }

                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
            }
        });

        hotkeys.add({
            combo: 'shift+right',
            callback: function() {
                resetDirc("right");

                if ($scope.node.current.length >= 4) {
                    if ($scope.node.depth == 0) {
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
                    }

                    checkNext($scope.chart_config.nodeStructure, $scope.node.next);
                }
            }
        });
        hotkeys.add({
            combo: 'shift+left',
            callback: function() {

                resetDirc("left");

                if ($scope.node.depth > 0) {
                    $scope.node.depth--;
                }
                if ($scope.node.depth >= 0 && $scope.node.current.length >= 4) {
                    $scope.node.current.splice($scope.node.current.length-3, 1, $scope.node.depth);
                    var nextSrc = _.take($scope.node.current, $scope.node.current.length);
                    if ($scope.node.depth == 0) {
                        nextSrc.splice(nextSrc.length-3, 1, $scope.node.depth);
                    } else {
                        nextSrc.splice(nextSrc.length-3, 1, $scope.node.depth-1);
                    }

                    $scope.node.next = nextSrc;
                }

                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
            }
        });

    }]);