angular.module("treeCtrl", [])
    .controller("treeController", ["$scope", "$timeout", "hotkeys", function ($scope, $timeout, hotkeys) {

        $scope.chart_config = {
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

        $scope.currentNode;
        $scope.node = {
            level: 0,
            depth: 0
        };

        hotkeys.add({
            combo: 'shift+down',
            description: 'This one goes to 11',
            callback: function() {
                if ($scope.node.level == 0) {
                    $scope.currentNode = $scope.chart_config.nodeStructure.children[0].text.name;
                    $scope.node.level++;
                } else if ($scope.node.level > 0) {
                    $scope.currentNode = $scope.chart_config.nodeStructure.children[0].children[0].text.name;

                }

            }
        });
        hotkeys.add({
            combo: 'shift+up',
            description: 'This one goes to 11',
            callback: function() {
                $scope.nodeLevel--;
            }
        });
        hotkeys.add({
            combo: 'shift+left',
            description: 'This one goes to 11',
            callback: function() {
                $scope.currentNode -= 1;
            }
        });
        hotkeys.add({
            combo: 'shift+right',
            description: 'This one goes to 11',
            callback: function() {
                $scope.currentNode -= 1;
            }
        });

        if ($scope.chart_config.nodeStructure.text.name.children) {

        }

        $scope.initialized = false;

        $scope.$watch(function () {
            //$scope.currentNode = $scope.chart_config.nodeStructure.text.name;
        });

        $scope.currentNode = $scope.chart_config.nodeStructure.text.name;
        $scope.chart = new Treant($scope.chart_config);

        $scope.setTopic = function () {
            if (this.topic !== undefined) {
                $scope.chart_config.nodeStructure.text.name = this.topic;
                $timeout(function () {
                    $scope.chart = new Treant($scope.chart_config);
                });
                $scope.currentNode = this.topic;
                $scope.initialized = true;
            }
        };
        $scope.insertTopic = function () {
            $scope.chart_config.nodeStructure.children[2].children.push({
                text: {
                    name: this.topic2
                }
            });
            $scope.chart.destroy();
            $scope.chart = new Treant($scope.chart_config);
        };

    }]);