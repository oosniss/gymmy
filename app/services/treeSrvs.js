angular.module("treeSrvs", [])
    .constant("_", window._)
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    .service("treeServices", function () {

        var tree = {
            chart: {
                container: "#tree",
                rootOrientation: "NORTH",
                nodeAlign: "BOTTOM",
                node: {
                    HTMLclass: "big-commpany",
                    collapsable: true
                },
                connectors: {
                    type: "step"
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
                children: [
                    {
                        text: {name: "Account"},
                        children: [
                            {
                                text: {name: "Receptionist"}
                            },
                            {
                                text: {name: "Author"}
                            }
                        ]
                    },
                    {
                        text: {name: "Operation Manager"},
                        children: [
                            {
                                text: {name: "Manager I"},
                                children: [
                                    {
                                        text: {name: "Worker I"},
                                        children: [
                                            {
                                                text: {name: "Worker II"}
                                            }
                                        ]
                                    },
                                    {
                                        text: {name: "Worker III"}
                                    }
                                ]
                            },
                            {
                                text: {name: "Manager II"},
                                children: [
                                    {
                                        text: {name: "Worker I"}
                                    },
                                    {
                                        text: {name: "Worker II"}
                                    }
                                ]
                            },
                            {
                                text: {name: "Manager III"},
                                children: [
                                    {
                                        text: {name: "Worker I"}
                                    },
                                    {
                                        text: {name: "Worker II"}
                                    },
                                    {
                                        text: {name: "Worker III"}
                                    },
                                    {
                                        text: {name: "Worker IV"}
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        text: {name: "Delivery"},
                        children: [
                            {
                                text: {name: "Driver I"}
                            },
                            {
                                text: {name: "Driver II"}
                            },
                            {
                                text: {name: "Driver III"}
                            }
                        ]
                    }
                ]
            }
        };

        this.tree = function () {
            return tree;
        };
        
        this.init = function (topic) {
            if (_.has(tree.nodeStructure, "text.name")) {
                tree.nodeStructure.text.name = topic;
            }
        };

        this.push = function (topic) {
            tree.nodeStructure.children[2].children.push({
                text: {
                    name: topic
                }
            })
        }
    });