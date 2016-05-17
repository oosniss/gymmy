angular.module("treeCtrl", [])
    .constant('_', window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .controller("treeController", ["$scope", "hotkeys", "treeServices", "$compile", "$timeout", function ($scope, hotkeys, treeServices, $compile, $timeout) {

        // keep track of tree navigation
        $scope.node = {
            initialized: false,
            depth: 0,
            there: false,
            current: ["nodeTop"],
            next: ["children", 0],
            editAt: null,
            direction: null,
            tempValue: null,
            lastTask: null,
            classTarget: "nodeTop"
        };

        // create and refresh the tree
        $scope.init = function () {
            if ($scope.chart) {
                $scope.chart.destroy();
            }
            $scope.chart_config = treeServices.tree();
            $scope.chart = new Treant($scope.chart_config, function () {
                var target = angular.element(".nodeBranches");
                for (var i = 0; i < target.length; i++) {
                    var id = target.eq(i).attr("id");
                    target.eq(i).attr("ng-class", "changeClass('" + id + "')");
                }
                $compile(target)($scope);
            });
        };

        // set the main topic of the tree
        $scope.setTopic = function () {
            treeServices.init(this.topic);
            // update the view
            $scope.init();
            $scope.node.initialized = true;
        };

        $scope.$watch(function () {
            $scope.node.classTarget = _.join($scope.node.current, "");
            $scope.node.editAt = _.take($scope.node.current, $scope.node.current.length);
            $scope.node.editAt.push("text", "name");
        });

        $scope.changeClass = function (newValue) {
            return $scope.node.classTarget == newValue ? "active" : "";
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
                if ($scope.node.current[0] == "nodeTop") {
                    var initCheck = _.take($scope.node.current, $scope.node.current.length);
                    initCheck.splice(0, 1, "children", $scope.node.depth);
                    if (_.has($scope.chart_config.nodeStructure, initCheck)) {
                        console.log("POWER");
                        $scope.node.current.splice(0, 1, "children", $scope.node.depth);
                        var next = _.take($scope.node.current, $scope.node.current.length);
                        next.push("children", $scope.node.depth);
                        $scope.node.next = next;
                    }
                } else {
                    $scope.node.current.push("children", $scope.node.depth);
                    var next2 = _.take($scope.node.current, $scope.node.current.length);
                    next2.push("children", $scope.node.depth);
                    $scope.node.next = next2;
                    if ($scope.node.there) {
                        $scope.node.current.splice($scope.node.current.length-2, 2);
                        $scope.node.next.splice($scope.node.next.length-2, 2);
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
                    console.log("TRUE");
                    $scope.node.current.splice($scope.node.current.length-2, 2);
                    var next = _.take($scope.node.current, $scope.node.current.length);
                    next.splice(next.length-2, 2);
                    $scope.node.next = next;
                } else {
                    $scope.node.current = ["nodeTop"];
                    $scope.node.next = ["children", 0];
                }
                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
                console.log($scope.node.current);
                console.log($scope.node.next);
            }
        });

        hotkeys.add({
            combo: 'shift+right',
            callback: function() {
                resetDirc("right");

                if ($scope.node.current.length >= 2) {
                    if ($scope.node.depth == 0) {
                        $scope.node.there = false;
                    }
                    $scope.node.depth++;
                    $scope.node.current.splice($scope.node.current.length-1, 1, $scope.node.depth);
                    var next = _.take($scope.node.current, $scope.node.current.length);
                    next.splice(next.length-1, 1, $scope.node.depth+1);
                    $scope.node.next = next;
                    if ($scope.node.there) {
                        $scope.node.depth--;
                        $scope.node.current.splice($scope.node.current.length-1, 1, $scope.node.depth);
                        $scope.node.next.splice($scope.node.next.length-1, 1, $scope.node.depth+1);
                    }
                }
                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
                console.log($scope.node.current);
                console.log($scope.node.next);
            }
        });
        hotkeys.add({
            combo: 'shift+left',
            callback: function() {
                resetDirc("left");
                if ($scope.node.depth > 0) {
                    $scope.node.depth--;
                }

                if ($scope.node.depth >= 0 && $scope.node.current.length >= 2) {
                    $scope.node.current.splice($scope.node.current.length-1, 1, $scope.node.depth);
                    var next = _.take($scope.node.current, $scope.node.current.length);
                    if ($scope.node.depth == 0) {
                        next.splice(next.length-1, 1, $scope.node.depth);
                    } else {
                        next.splice(next.length-1, 1, $scope.node.depth-1);
                    }
                }
                checkNext($scope.chart_config.nodeStructure, $scope.node.next);
                console.log($scope.node.current);
                console.log($scope.node.next);
            }
        });
        hotkeys.add({
            combo: "shift+d",
            callback: function () {
                treeServices.delete(_.take($scope.node.current, $scope.node.current.length-1), $scope.node.current[$scope.node.current.length-1]);
                $scope.init();
                $scope.node.current = ["nodeTop"];
                $scope.node.next = ["children", 0];
            }
        });

        // Edit the current node
        hotkeys.add({
            combo: "shift+e",
            callback: function () {
                $scope.node.lastTask = "edit";
                var editField = angular.element(".active");
                $scope.node.tempValue = editField.children().text();
                editField.empty();
                var newField = "<form ng-submit='editNode()'><input class='editNode mousetrap' type='text' ng-model='edited'></form>";
                editField.append(newField);
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                $compile(editField)($scope);
            }
        });

        $scope.editNode = function () {
            treeServices.edit($scope.node.editAt, this.edited);
            $scope.init();
            this.edited = "";
        };

        // Insert a new node for the current node
        hotkeys.add({
            combo: "shift+n",
            callback: function () {
                $scope.node.lastTask = "insert";
                treeServices.push("<form ng-submit='newNode()'><input class='editNode mousetrap' type='text' ng-model='inserted'></form>", $scope.node.current);
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                $scope.init();
            }
        });

        $scope.newNode = function () {
            treeServices.new($scope.node.current, this.inserted);
            $scope.init();
            this.inserted = "";
        };

        hotkeys.add({
            combo: "esc",
            callback: function () {
                if ($scope.node.lastTask == "edit") {
                    treeServices.edit($scope.node.editAt, $scope.node.tempValue);
                } else if ($scope.node.lastTask == "insert") {
                    treeServices.delete(_.take($scope.node.current, $scope.node.current.length-1), $scope.node.current[$scope.node.current.length-1]);
                    console.log($scope.node.current);
                    if ($scope.node.current.length == 2) {
                        $scope.node.current = ["nodeTop"]
                    } else {
                        $scope.node.current.splice(-2, 2);
                    }
                }
                $scope.init();
                this.edited = "";
            }
        });

    }]);