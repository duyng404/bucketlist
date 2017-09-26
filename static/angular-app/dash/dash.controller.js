angular.module('bucketlist').controller('DashController',DashController);

function DashController($route, $routeParams, dataFactory){
	var vm = this;
	var usrid = $routeParams.usrid;

	// various arrays for managing displayed lists
	vm.entryForm = [];
	vm.entryBodyField = [];
	vm.entryFormVisible = [];

	dataFactory.userDash(usrid).then(function(response){
		vm.user = response.data;
		vm.lists = response.data.lists;
	});

	vm.addList = function() {
		var postData = {
			name: vm.name
		};
		dataFactory.postList(usrid, postData).then(function(res){
			if (res.status === 201){
				$route.reload();
			}
		}).catch(function(err){
			console.log(err);
		});
	}

	vm.deleteList = function(listid){
		dataFactory.deleteList(usrid,listid).then(function(res){
			if (res.status === 204){
				$route.reload();
			}
		}).catch(function(err){
			console.log(err);
		});
	}

	vm.addEntry = function(listid){
		var postData = { body: vm.entryBodyField[listid] };
		dataFactory.addEntry(usrid,listid,postData).then(function(res){
			if (res.status === 201){
				$route.reload();
			}
		}).catch(function(err){
			console.log(err);
		});
	}

	vm.deleteEntry = function(listid,entryid){
		dataFactory.deleteEntry(usrid,listid,entryid).then(function(res){
			if (res.status === 204){
				$route.reload();
			}
		}).catch(function(err){
			console.log(err);
		});
	}
}
