angular.module('bucketlist').controller('LoginController', LoginController);

function LoginController(dataFactory){
	var vm = this;
	vm.title = 'Login to Bucketlist App';
	// get list of users from dataFactory
	dataFactory.getAllUser().then(function(res){
		vm.users = res.data;
	});
}
