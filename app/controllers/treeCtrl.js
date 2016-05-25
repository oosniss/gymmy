angular.module("treeCtrl", [])
    .constant('_', window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .controller("treeController", ["$scope", "hotkeys", "treeServices", "$compile", "$timeout", function ($scope, hotkeys, treeServices, $compile, $timeout) {

        // force focus on the input
        angular.element(".init > form > input").focus();

        // keep track of tree navigation
        $scope.node = {
            depth: 0,
            current: ["nodeTop"],
            tempValue: null,
            lastTask: null,
            classTarget: "nodeTop"
        };

        // keep track of class change and editing point
        $scope.$watch(function () {
            $scope.node.initialized = treeServices.config();
            // update the value for ngClass
            $scope.node.classTarget = _.join($scope.node.current, "");
            // keep track of index number of the current item in the children array
            $scope.node.depth = $scope.node.current[$scope.node.current.length - 1];
        });

        // create and refresh the tree
        $scope.init = function () {
            // remove the current tree
            if ($scope.chart) {
                $scope.chart.destroy();
            }
            // recreate the tree with updated information
            $scope.chart_config = treeServices.tree();
            $scope.chart = new Treant($scope.chart_config, function () {
                // attach ngClass directives to each tree item
                var target = angular.element(".nodeBranches");
                for (var i = 0; i < target.length; i++) {
                    target.eq(i).attr("ng-class", "changeClass('" + target.eq(i).attr("id") + "')");
                }
                $compile(target)($scope);
            });
        };

        // set the main topic for the tree
        $scope.setTopic = function () {
            // set the value for the top item
            treeServices.init(this.topic);
            // create the tree and update the view
            $scope.init();
        };

        // update the class for each items
        $scope.changeClass = function (newValue) {
            return $scope.node.classTarget == newValue ? "active" : "";
        };

        // receive the value from the form via ng-submit and edit the current item
        $scope.editNode = function () {
            // receive the new value for the field that is being edited
            treeServices.edit($scope.node.current, this.edited);
            // refresh the tree and empty the input field
            $scope.init();
            this.edited = "";
        };

        // receive the value from the form via ng-submit and create a new item in the tree
        $scope.newNode = function () {
            // empty the field used to receive the new value and set the text value
            treeServices.set($scope.node.current, this.inserted);
            // refresh the tree and empty the input
            $scope.init();
            this.inserted = "";
        };

        // go down one level
        hotkeys.add({
            combo: 'down',
            description: "Move down",
            callback: function () {
                // always go down to the first item in the next level
                $scope.node.depth = 0;
                // store the value to check if the tree has the next item
                var nextCheck = _.take($scope.node.current, $scope.node.current.length);
                // if the current item is the top item
                if ($scope.node.current[0] == "nodeTop") {
                    // remove "nodeTop" and insert "children" and "0"
                    nextCheck.splice(0, 1, "children", $scope.node.depth);
                } else {
                    // if not, keep inserting "children" and "0"
                    nextCheck.push("children", $scope.node.depth);
                }
                // update the current item only if the tree has the next item
                if (_.has($scope.chart_config.nodeStructure, nextCheck)) {
                    $scope.node.current = nextCheck;
                }
            }
        });

        // go up one level
        hotkeys.add({
            combo: 'up',
            description: "Move up",
            callback: function() {
                if ($scope.node.current.length > 2) {
                    // go up one level only when the top item has children
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
            description: "Move right",
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
            description: "Move left",
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
            description: "Delete the current item",
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
            description: "Edit the current item",
            callback: function () {
                // specify which task was run for "esc" hotkey function
                $scope.node.lastTask = "edit";
                var editField = angular.element(".active");
                // store the value of the current item to return to when "esc" was pressed
                $scope.node.tempValue = editField.children().text();
                // empty the current item and insert the form
                editField.empty();
                var newField = "<form ng-submit='editNode()'><input class='editNode' type='text' ng-model='edited'></form>";
                editField.append(newField);
                // force the focus on the form
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                // compile the new form
                $compile(editField)($scope);
            }
        });

        // Insert a new children for the current item
        hotkeys.add({
            combo: "n",
            callback: function () {
                // specify which task was ran for "esc" hotkey function
                $scope.node.lastTask = "insert";
                // create a new item with a form to enter the value for the new item
                treeServices.push("<form ng-submit='newNode()'><input class='editNode' type='text' ng-model='inserted'></form>", $scope.node.current);
                // force the focus on the form
                $timeout(function () {
                    angular.element(".editNode").focus();
                }, 1);
                // refresh the tree with the new item
                $scope.init();
            }
        });

        hotkeys.add({
            combo: "esc",
            allowIn: ['INPUT'],
            callback: function () {
                if ($scope.node.lastTask == "edit") {
                    // if the user is editing an item, restore the original value
                    treeServices.edit($scope.node.current, $scope.node.tempValue);
                } else if ($scope.node.lastTask == "insert") {
                    // if the user is inserting a new item, delete the form and the item
                    treeServices.delete(_.take($scope.node.current, $scope.node.current.length-1), $scope.node.current[$scope.node.current.length-1]);
                    // resetting back to default
                    if ($scope.node.current.length == 2) {
                        $scope.node.current = ["nodeTop"];
                    } else {
                        $scope.node.current.splice(-2, 2);
                    }
                }
                // refresh the tree
                $scope.init();
                this.edited = "";
            }
        });
    }]);