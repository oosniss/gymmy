angular.module("treeSrvs", [])
    .constant("_", window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .service("treeServices", function () {

        // objects for Treant.js
        var tree = {
            chart: {
                container: "#tree",
                rootOrientation: "NORTH",
                nodeAlign: "BOTTOM",
                node: {
                    HTMLclass: "nodeBranches",
                    collapsable: true
                },
                connectors: {
                    type: "step",
                    style: {
                        "stroke": "#39496B",
                        "stroke-width": 2.5
                    }
                },
                animation: {
                    nodeAnimation: "easeOutBounce",
                    nodeSpeed: 700,
                    connectorsAnimation: "bounce",
                    connectorsSpeed: 700
                }
            },
            nodeStructure: {
                text: {
                    name: "CEO"
                },
                HTMLid: "nodeTop",
                children: []
            }
        };

        // values for connector colours
        var colOptions = ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3", "#03A9F4", "#00BCD4", "#009688", "#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800", "#FF5722", "#795548", "#9E9E9E", "#607D8B"];

        // set the initial value for the top item
        this.init = function (topic) {
            tree.nodeStructure.text.name = topic;
        };

        // edit the value for the current item
        this.edit = function (target, value) {
            var editAt = _.take(target, target.length);

            // if the item to edit is the top item
            if (editAt[0] == "nodeTop") {
                // empty the array
                editAt.splice(0, 1);
            }

            // change the target so it targets the text.name value
            editAt.push("text", "name");

            // set the new value for the target
            _.set(tree.nodeStructure, editAt, value);
        };

        // set the new value for the new item
        this.set = function (target, value) {
            // change the target so it targets the text.name value
            target.push("text", "name");

            // set the new value for the target
            _.set(tree.nodeStructure, target, value);

            // empty the form used to enter the new value
            target.splice(target.length-2, 2, "innerHTML");
            _.set(tree.nodeStructure, target, "");

            // update the target so that the class is applied to the current item
            target.splice(target.length-1, 1);
        };

        // prepare a form to enter new value for new item
        this.push = function (form, insertAt) {
            // change the position to insert
            if (insertAt[0] == "nodeTop") {
                insertAt.splice(0, 1, "children");
            } else {
                insertAt.push("children");
            }

            // if the current item does not have its children initiated
            if (!_.has(tree.nodeStructure, insertAt)) {
                // initiate it with a new array
                _.set(tree.nodeStructure, insertAt, []);
            }

            var pushTo = _.get(tree.nodeStructure, insertAt);
            // insert the index number to which the new item will be pushed
            // so that the new item has a correct ID name
            insertAt.push(pushTo.length);
            // push the form in which the new value will be entered
            pushTo.push({
                // empty at first, new value will be given from the form (line 178)
                text: {
                    name: ""
                },
                // this form will be deleted once new value is submitted (line 181 & 182)
                innerHTML: form,
                connectors: {
                    style: {
                        "stroke": colOptions[Math.floor(Math.random() * colOptions.length-1)]
                    }
                },
                // unique ID for each item, used for ngClass
                HTMLid: _.join(insertAt, "")
            });
        };

        // delete current item and all of its children
        this.delete = function (arr, idx) {
            // last item in $scope.node.current will be deleted
            var deleteFrom = _.get(tree.nodeStructure, arr);
            deleteFrom.splice(idx, 1);
        };

        this.tree = function () {
            return tree;
        };
    });