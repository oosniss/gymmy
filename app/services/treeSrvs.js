angular.module("treeSrvs", [])
    .constant("_", window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .service("treeServices", function () {
        var colOptions = [];
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
                children: [/*
                    {
                        text: {name: "Account"},
                        HTMLid: "children0",
                        children: [
                            {
                                text: {name: "Receptionist"},
                                HTMLid: "children0children0"
                            },
                            {
                                text: {name: "Author"},
                                HTMLid: "children0children1",
                                children: []
                            }
                        ]
                    },
                    {
                        text: {name: "Operation Manager"},
                        HTMLid: "children1",
                        children: [
                            {
                                text: {name: "Manager I"},
                                HTMLid: "children1children0",
                                children: [
                                    {
                                        text: {name: "Worker I"},
                                        HTMLid: "children1children0children0",
                                        children: [
                                            {
                                                text: {name: "Worker II"},
                                                HTMLid: "children1children0children0children0",
                                                children: []
                                            }
                                        ]
                                    },
                                    {
                                        text: {name: "Worker III"},
                                        HTMLid: "children1children0children1",
                                        children: []
                                    }
                                ]
                            },
                            {
                                text: {name: "Manager II"},
                                HTMLid: "children1children1",
                                children: [
                                    {
                                        text: {name: "Worker I"},
                                        HTMLid: "children1children1children0",
                                        children: []
                                    },
                                    {
                                        text: {name: "Worker II"},
                                        HTMLid: "children1children1children1",
                                        children: []
                                    }
                                ]
                            },
                            {
                                text: {name: "Manager III"},
                                HTMLid: "children1children2",
                                children: [
                                    {
                                        text: {name: "Worker I"},
                                        HTMLid: "children1children2children0",
                                        children: []
                                    },
                                    {
                                        text: {name: "Worker II"},
                                        HTMLid: "children1children2children1",
                                        children: []
                                    },
                                    {
                                        text: {name: "Worker III"},
                                        HTMLid: "children1children2children2",
                                        children: []
                                    },
                                    {
                                        text: {name: "Worker IV"},
                                        HTMLid: "children1children2children3",
                                        children: []
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: {name: "Delivery"},
                        HTMLid: "children2",
                        children: [
                            {
                                text: {name: "Driver I"},
                                HTMLid: "children2children0",
                                children: []
                            },
                            {
                                text: {name: "Driver II"},
                                HTMLid: "children2children1",
                                children: []
                            },
                            {
                                text: {name: "Driver III"},
                                HTMLid: "children2children2",
                                children: []
                            }
                        ]
                    }
                 */]
            }
        };
        this.tree = function () {
            return tree;
        };
        this.init = function (topic) {
            tree.nodeStructure.text.name = topic;
        };

        this.edit = function (target, value) {
            if (target[0] == "nodeTop") {
                target.splice(0, 1);
            }
            _.set(tree.nodeStructure, target, value);
        };

        this.new = function (target, value) {
            target.push("text", "name");
            _.set(tree.nodeStructure, target, value);
            target.splice(target.length-2, 2, "innerHTML");
            _.set(tree.nodeStructure, target, "");
            target.splice(target.length-1, 1);
        };

        this.push = function (form, insertAt) {
            if (insertAt[0] == "nodeTop") {
                insertAt.splice(0, 1, "children");
            } else {
                insertAt.push("children");
            }

            if (!_.has(tree.nodeStructure, insertAt)) {
                _.set(tree.nodeStructure, insertAt, []);
            }

            var pushTo = _.get(tree.nodeStructure, insertAt);
            insertAt.push(pushTo.length);
            pushTo.push({
                text: {name: ""},
                innerHTML: form,
                HTMLid: _.join(insertAt, "")
            });/*
            if (pushTo.length > 3) {
                var stack = _.take(insertAt, insertAt.length-2);
                stack.push("stackChildren");
                _.set(tree.nodeStructure, stack, true);
            }*/
        };

        this.delete = function (arr, idx) {
            var deleteFrom = _.get(tree.nodeStructure, arr);
            deleteFrom.splice(idx, 1);
        };
        
    });