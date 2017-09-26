angular.module('bucketlist').factory('dataFactory',dataFactory);

function dataFactory($http){
	return{
		getAllUser: getAllUser,
		userDash: userDash,
		postList: postList,
		deleteList: deleteList,
		addEntry: addEntry,
		deleteEntry: deleteEntry
	};

	function getAllUser() {
		return $http.get('/api/debug/alluser').then(complete).catch(failed);
	}

	function userDash(usrid){
		return $http.get('/api/'+usrid).then(complete).catch(failed);
	}

	function postList(usrid, list){
		return $http.post('/api/'+usrid+'/lists',list).then(complete).catch(failed);
	}

	function deleteList(usrid,listid){
		return $http.delete('/api/'+usrid+'/lists/'+listid).then(complete).catch(failed);
	}

	function addEntry(usrid, listid, entry){
		return $http.post('/api/'+usrid+'/lists/'+listid+'/entries',entry).then(complete).catch(failed);
	}

	function deleteEntry(usrid, listid, entryid){
		return $http.delete('/api/'+usrid+'/lists/'+listid+'/entries/'+entryid).then(complete).catch(failed);
	}

	function complete(response){
		return response;
	}

	function failed(error){
		console.log(error.statusText);
	}
}

