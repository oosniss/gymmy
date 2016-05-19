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
            current: ["nodeTop"],
            nextCheck: [],
            tempValue: null,
            lastTask: null,
            classTarget: "nodeTop",
            mousetrap: true
        };

        // create and refresh the tree
        $scope.init = function () {
            // remove the current tree
            if ($scope.chart) {
                $scope.chart.destroy();
            }
            // recreate the tree with updated information
            $scope.chart_config = treeServices.tree();
            $scope.chart = new Treant($scope.chart_config, function () {
                // attach ngClass directives to the tree items
                var target = angular.element(".nodeBranches");
                for (var i = 0; i < target.length; i++) {
                    target.eq(i).attr("ng-class", "changeClass('" + target.eq(i).attr("id") + "')");
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

        // keep track of class change and editing point
        $scope.$watch(function () {
            // update the value for ngClass
            $scope.node.classTarget = _.join($scope.node.current, "");
            // keep track of how deep the current item is
            $scope.node.depth = $scope.node.current[$scope.node.current.length-1];
        });

        // update the class for each items
        $scope.changeClass = function (newValue) {
            return $scope.node.classTarget == newValue ? "active" : "";
        };

        // go down one level
        hotkeys.add({
            combo: 'down',
            callback: function() {
                // always go down to the first item in the next level
                $scope.node.depth = 0;

                // store the value to check if the tree has the next item
                var nextCheck = _.take($scope.node.current, $scope.node.current.length);

                if ($scope.node.current[0] == "nodeTop") {
                    // if the current item is the top item
                    nextCheck.splice(0, 1, "children", $scope.node.depth);
                } else {
                    nextCheck.push("children", $scope.node.depth);
                }

                // if the tree has the next item, move to the next item.
                if (_.has($scope.chart_config.nodeStructure, nextCheck)) {
                    $scope.node.current = nextCheck;
                }
            }
        });

        // go up one level
        hotkeys.add({
            combo: 'up',
            callback: function() {
                // go up one level only when the top item has children
                if ($scope.node.current.length > 2) {
                    $scope.node.current.splice($scope.node.current.length - 2, 2);
                } else {
                    // if not, reset to default
                    $scope.node.current = ["nodeTop"];
                    $scope.node.next = ["children", 0];
                }
            }
        });

        // go right one level
        hotkeys.add({
            combo: 'right',
            callback: function() {
                // store the value to check if the tree has the next item
                var nextCheck = _.take($scope.node.current, $scope.node.current.length);

                // go up one level only when the top item has children
                if ($scope.node.current.length >= 2) {
                    // increment the depth value to move to the next children
                    $scope.node.depth++;
                    nextCheck.splice(nextCheck.length - 1, 1, $scope.node.depth);
                    if (_.has($scope.chart_config.nodeStructure, nextCheck)) {
                        $scope.node.current = nextCheck;
                    }
                }
            }
        });

        // go left one level
        hotkeys.add({
            combo: 'left',
            callback: function() {
                // move to the previous children
                // only when the current item is not the first children or the top item
                if ($scope.node.depth > 0 && $scope.node.current.length >= 2) {
                    $scope.node.depth--;
                    $scope.node.current.splice($scope.node.current.length - 1, 1, $scope.node.depth);
                }
            }
        });
        hotkeys.add({
            combo: "del",
            callback: function () {
                // delete the current item and all of its children
                treeServices.delete(_.take($scope.node.current, $scope.node.current.length - 1), $scope.node.current[$scope.node.current.length - 1]);
                // refresh the tree and return to the top item
                $scope.node.current = ["nodeTop"];
                $scope.node.next = ["children", 0];
                $scope.init();
            }
        });

        // Edit the current node
        hotkeys.add({
            combo: "e",
            callback: function () {
                $scope.node.lastTask = "edit";
                var editField = angular.element(".active");
                $scope.node.tempValue = editField.children().text();
                editField.empty();
                var newField = "<form ng-submit='editNode()'><input class='editNode' type='text' ng-model='edited'></form>";
                editField.append(newField);
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                $compile(editField)($scope);
            }
        });
        $scope.editNode = function () {
            treeServices.edit($scope.node.current, this.edited);
            $scope.init();
            this.edited = "";
        };

        // Insert a new node for the current node
        hotkeys.add({
            combo: "n",
            callback: function () {
                $scope.node.lastTask = "insert";
                treeServices.push("<form ng-submit='newNode()'><input class='editNode' type='text' ng-model='inserted'></form>", $scope.node.current);
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                $scope.init();
            }
        });
        $scope.newNode = function () {
            treeServices.set($scope.node.current, this.inserted);
            $scope.init();
            this.inserted = "";
        };
        hotkeys.add({
            combo: "esc",
            callback: function () {
                if ($scope.node.mousetrap) {
                    if ($scope.node.lastTask == "edit") {
                        treeServices.edit($scope.node.current, $scope.node.tempValue);
                    } else if ($scope.node.lastTask == "insert") {
                        treeServices.delete(_.take($scope.node.current, $scope.node.current.length-1), $scope.node.current[$scope.node.current.length-1]);
                        if ($scope.node.current.length == 2) {
                            $scope.node.current = ["nodeTop"];
                        } else {
                            $scope.node.current.splice(-2, 2);
                        }
                    }
                    $scope.init();
                    this.edited = "";
                }
            }
        });
    }]);