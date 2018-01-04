angular.module('dmt-back').controller('listItemExtendedController', function ($scope, $mdDialog, $location, page, $http) {
    var ctrl = this;
    ctrl.page = page;
    ctrl.entity = dmt.entities[page.entity];
    ctrl.breadcrum = buildBreadcrum($location.path(),page);
    ctrl.language = 1;
    ctrl.sibling = page.parent.pages;
    this.selectPage = function (page) {
		$location.path(page.parent.path + "/" + page.path);
	};
    /**
     * Manipulate items
     */
    $scope.create = function (event) {
        var path = $location.path();
        path+="/add";
        $location.path(path);
    };

    $scope.editField = function (event, item, field) {
        var path = $location.path();
        var id = item.id;
        ctrl.entity.fields.forEach((f)=>{
            if(f.key){
                id = item[f.name];
            }
        })
        path+="/detail/"+id;
        $location.path(path);
    };

    $scope.delete = function (event) {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: ctrl.entity.delete ? ctrl.entity.delete.controller || 'deleteItemController' : 'deleteItemController',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: {
                entity: ctrl.entity,
                items: $scope.selected
            },
            templateUrl: ctrl.entity.delete ? ctrl.entity.delete.templateUrl || 'views/default/delete-dialog.html' : 'views/default/delete-dialog.html',
        }).then($scope.getData);
    };

    /**
     * Selection variables
     */
    $scope.results = [];
    $scope.selected = [];
    $scope.filter = {
        options: {
            debounce: 500
        }
    };
    var bookmark;
    $scope.$watch('query.filter', function (newValue, oldValue) {
        if (!oldValue) {
            bookmark = $scope.query.page;
        }
        if (newValue !== oldValue) {
            $scope.query.page = 1;
        }
        if (!newValue) {
            $scope.query.page = bookmark;
        }
        $scope.getData();
    });
    $scope.removeFilter = function () {
        $scope.filter.show = false;
        $scope.query.filter = '';

        if ($scope.filter.form.$dirty) {
            $scope.filter.form.$setPristine();
        }
    };

    $scope.query = {
        filter: '',
        order: page ? ctrl.entity.defaultSort : "name",
        limit: 20,
        page: 1,
        filters: ctrl.page.filters || {}
    };

    $scope.getSuccess = function (results) {
        $scope.items = results.data.data;
        $scope.total_results = results.data.total_results;
    };

    $scope.getData = function () {
		/**
		 * Webservices composed by endpoint + table
		 */
        if (!ctrl.entity) {
            return;
        }
        let str = [];
        for (let p in $scope.query) {
            if (p !== "filters") {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent($scope.query[p]));
            }
        }
        for (let p in ctrl.entity.fields) {
            if (ctrl.entity.fields[p].searchable) {
                str.push("field=" + ctrl.entity.fields[p].name);
            }
        }
        for (let key in $scope.query.filters) {
            if ($scope.query.filters[key]) {
                $scope.query.filters[key].forEach((value) => {
                    str.push("filter_field=" + key);
                    str.push("filter_value=" + value);
                })
            }
        }
        str.push("lang="+ctrl.language);
        let filter = str.join("&");

        $scope.promise = $http.get(ctrl.entity.endpoint + "?" + filter);
        $scope.promise.then($scope.getSuccess).catch(function (response) {
            window.location.href = "/admin/login";
        });
    };

    /**
     * Initialize data
     */

    function addOptions(item, index) {
        var base = item.endpoint;
		if (!base) {
			let entity = dmt.entities[item.table];
			let table = null
			if (!entity) {
				entity = dmt.tables[item.table];
			} 
			base = entity.endpoint
		}
		if (!base) {
			base = ctrl.currentEntity.endpoint;
		}
        $http.get(base).then(function (results) {
            ctrl.options[item.name] = results.data.data;
        });
    }
    function updateFilter(filter) {
        if (filter.filter) { //affects another filter
            ctrl.entity.filters.forEach((item) => {
                if (item.name === filter.filter) { //find the associated filter
                    if (filter.selected === "null") { //cleaning the filter
                        item.options = item.fulloptions || item.options;
                        delete item.fulloptions;
                    } else {
                        if (!item.fulloptions) {
                            item.fulloptions = item.options; // store the options
                        }
                        item.options = item.fulloptions.filter((option) => { //filter the options
                            let match = true;
                            filter.fields.forEach((field) => { //iterate trough the values
                                if (option[field] != filter.selected) { //AND relation
                                    match = false;
                                }
                            })
                            return match;
                        });
                    }
                }
            });
        } else { //direct fields
            if (filter.selected === "null") { //cleaning the filter
                filter.fields.forEach((field) => { //iterate trough the values
                    $scope.query.filters[field.name] = [];
                })
                $scope.getData();
            } else {
                filter.fields.forEach((field) => { //iterate trough the values
                    $scope.query.filters[field.name] = [];
                    ctrl.options[field.name].forEach((option) => {
                        if (option[field.foreign_key] == filter.selected) { //AND relation
                            $scope.query.filters[field.name].push(option[filter.foreign_key]);
                        }
                    })
                })
                $scope.getData();
            }
        }
    }

    function addFilters(item, index) {
        var base = item.endpoint;
		if (!base) {
			let entity = dmt.entities[item.table];
			let table = null
			if (!entity) {
				entity = dmt.tables[item.table];
			} 
			base = entity.endpoint
		}
		if (!base) {
			base = ctrl.currentEntity.endpoint;
		}
        $http.get(base).then(function (results) {
            item.options = results.data.data;
        });
    }

    $scope.getData();
    ctrl.fulloptions = {};
    ctrl.options = {};
    ctrl.updateFilter = updateFilter;

    var opts = [];
    for (var i in ctrl.entity.fields) {
        var f = ctrl.entity.fields[i];
        if (f.type === 'link') {
            opts.push(f);
        }
    }
    opts.forEach(addOptions);
    if (ctrl.entity.filters) {
        ctrl.entity.filters.forEach(addFilters);
    }

});
