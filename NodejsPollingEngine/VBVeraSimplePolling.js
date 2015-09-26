var http = require('http');
var events = require('events');

function vc(){


	this.ConsoleLog	= false;

	this.States 					= {};

	this.States.New 				= 'New';

	this.States.SysinfoLoading	= 'SysinfoLoading';
	this.States.SysinfoLoaded		= 'SysinfoLoaded';
	this.States.SysinfoError		= 'SysinfoError';

	this.States.UserDataLoading	= 'UserDataLoading';
	this.States.UserDataLoaded	= 'UserDataLoaded';
	this.States.UserDataError		= 'UserDataError';

	this.States.StaticDataLoading	= 'StaticDataLoading';
	this.States.StaticDataLoaded	= 'StaticDataLoaded';
	this.States.StaticDataError	= 'StaticDataError';

	this.States.LuStatusLoading	= 'LuStatusLoading';
	this.States.LuStatusLoaded	= 'LuStatusLoaded';
	this.States.LuStatusError		= 'LuStatusError';

	this.state		= this.States.New;
	this.data			= {
		 'SysInfo'	: {}
		,'UserData' : {}
		,'LuStatus' : {}
	};

	this.url = {
	 	 'UserData'			: '/port_3480/data_request?id=user_data'
		,'StaticData'		: '/port_3480/data_request?id=static'
		,'LuStatus'			: '/port_3480/data_request?id=lu_status'
		,'SysInfo'			: '/cgi-bin/cmh/sysinfo.sh'
		,'Protocol'			: 'http'
		,'Port'				: 80
		,'IP'				: false
		,'timeout'			: 10
	};

	this.timings = {
		 'PollMinimumDelay' 	: 10000
		,'PollTimeout'			: 60
	};

	this.lastRequest = {
		 'status' : false
		,'headers': false
		,'done'   : false
		,'type'	  : false
	};

	this.events = new events.EventEmitter();
}


vc.prototype.log = function(data){
	if(this.ConsoleLog===true){
		console.log(data);
	}
};

vc.prototype.init = function(config){
	for(var i in config){
		this.setConfig(i,config[i]);
	}
};

vc.prototype.start = function(){
	var vcontroller=this;
	setTimeout(function(){
		vcontroller.doNext();
	});
};

vc.prototype.setState = function(newState){
	oldState = this.state;
	this.state = newState;
	this.events.emit('stateChange',newState,oldState);
};

vc.prototype.loadSysInfo = function(){
	this.setState(this.States.SysinfoLoading);
	this.lastRequestStart('sysinfo');
	var options = {
		 host	: this.url['IP']
		,port	: this.url['Port']
		,path	: this.url['SysInfo']
		,method	: 'GET'
		,timeout: this.url['timeout']
	};
	this.log(['loadSysInfo','http-options',options]);
	var parentvc=this;
	var req = http.request(options,function(res){
		parentvc.log(['loadSysInfo','STATUS:',res.statusCode]);
		parentvc.lastRequest['status']=res.statusCode;
		parentvc.log(['loadSysInfo','HEADERS:',JSON.stringify(res.headers)]);
		parentvc.lastRequest['headers']=JSON.stringify(res.headers);
		res.setEncoding('utf8');
		res.on('connection', function(){
			parentvc.log(['loadSysInfo','Connected']);
		});
		res.on('data', function (chunk) {
			parentvc.log(['loadSysInfo','BODY',chunk.trim().substring(0,60)+'...']);
			if(typeof(parentvc.lastRequest['body'])=="boolean"){
				parentvc.lastRequest['body']=chunk;
			}else{
				parentvc.lastRequest['body']+=chunk;
			}
		});
		res.on('close', function() {
		  	parentvc.log(['loadSysInfo','request closed']);
		  	parentvc.processLastRequest(false);
		});
		res.on('end', function() {
		  	parentvc.log(['loadSysInfo','request ended']);
		  	parentvc.processLastRequest(false);
		});
	});
	req.on('error', function(e) {
		parentvc.log(['loadSysInfo','problem with request:',e.message]);
		parentvc.processLastRequest(e);
	});
	req.end();
};

vc.prototype.loadUserData = function(){
	this.setState(this.States.UserDataLoading);
	this.lastRequestStart('userdata');
	var options = {
		 host	: this.url['IP']
		,port	: this.url['Port']
		,path	: this.url['UserData']
		,method	: 'GET'
		,timeout: this.url['timeout']
	};
	this.log(['loadSysInfo','http-options',options]);
	var parentvc=this;
	var req = http.request(options,function(res){
		parentvc.log(['loadUserData','STATUS:',res.statusCode]);
		parentvc.lastRequest['status']=res.statusCode;
		parentvc.log(['loadUserData','HEADERS:',JSON.stringify(res.headers)]);
		parentvc.lastRequest['headers']=JSON.stringify(res.headers);
		res.setEncoding('utf8');
		res.on('connection', function(){
			parentvc.log(['loadUserData','Connected']);
		});
		res.on('data', function (chunk) {
			parentvc.log(['loadUserData','BODY',chunk.trim().substring(0,60)+'...']);
			if(typeof(parentvc.lastRequest['body'])=="boolean"){
				parentvc.lastRequest['body']=chunk;
			}else{
				parentvc.lastRequest['body']+=chunk;
			}
		});
		res.on('close', function() {
		  	parentvc.log(['loadUserData','request closed']);
		  	parentvc.processLastRequest(false);
		});
		res.on('end', function() {
		  	parentvc.log(['loadUserData','request ended']);
		  	parentvc.processLastRequest(false);
		});
	});
	req.on('error', function(e) {
		parentvc.log(['loadUserData','problem with request:',e.message]);
		parentvc.processLastRequest(e);
	});
	req.end();
};

vc.prototype.loadStaticData = function(){
	this.setState(this.States.StaticDataLoading);
	this.lastRequestStart('staticdata');
	var options = {
		 host	: this.url['IP']
		,port	: this.url['Port']
		,path	: this.url['StaticData']
		,method	: 'GET'
		,timeout: this.url['timeout']
	};
	this.log(['loadSysInfo','http-options',options]);
	var parentvc=this;
	var req = http.request(options,function(res){
		parentvc.log(['loadStaticData','STATUS:',res.statusCode]);
		parentvc.lastRequest['status']=res.statusCode;
		parentvc.log(['loadStaticData','HEADERS:',JSON.stringify(res.headers)]);
		parentvc.lastRequest['headers']=JSON.stringify(res.headers);
		res.setEncoding('utf8');
		res.on('connection', function(){
			parentvc.log(['loadStaticData','Connected']);
		});
		res.on('data', function (chunk) {
			parentvc.log(['loadStaticData','BODY',chunk.trim().substring(0,60)+'...']);
			if(typeof(parentvc.lastRequest['body'])=="boolean"){
				parentvc.lastRequest['body']=chunk;
			}else{
				parentvc.lastRequest['body']+=chunk;
			}
		});
		res.on('close', function() {
		  	parentvc.log(['loadStaticData','request closed']);
		  	parentvc.processLastRequest(false);
		});
		res.on('end', function() {
		  	parentvc.log(['loadStaticData','request ended']);
		  	parentvc.processLastRequest(false);
		});
	});
	req.on('error', function(e) {
		parentvc.log(['loadStaticData','problem with request:',e.message]);
		parentvc.processLastRequest(e);
	});
	req.end();
};

vc.prototype.loadLuStatus = function(pathparams){
	this.setState(this.States.LuStatusLoading);
	this.lastRequestStart('lustatus');
	var options = {
		 host	: this.url['IP']
		,port	: this.url['Port']
		,path	: this.url['LuStatus']
		,method	: 'GET'
		,timeout: this.url['timeout']
	};
	if(typeof(pathparams)!='undefined'){
		options['path']+='&'+pathparams;
	}
	this.log(['loadLuStatus','http-options',options]);
	var parentvc=this;
	var req = http.request(options,function(res){
		parentvc.log(['loadLuStatus','STATUS:',res.statusCode]);
		parentvc.lastRequest['status']=res.statusCode;
		parentvc.log(['loadLuStatus','HEADERS:',JSON.stringify(res.headers)]);
		parentvc.lastRequest['headers']=JSON.stringify(res.headers);
		res.setEncoding('utf8');
		res.on('connection', function(){
			parentvc.log(['loadLuStatus','Connected']);
		});
		res.on('data', function (chunk) {
			parentvc.log(['loadLuStatus','BODY',chunk.trim().substring(0,60)+'...']);
			if(typeof(parentvc.lastRequest['body'])=="boolean"){
				parentvc.lastRequest['body']=chunk;
			}else{
				parentvc.lastRequest['body']+=chunk;
			}
		});
		res.on('close', function() {
		  	parentvc.log(['loadLuStatus','request closed']);
		  	parentvc.processLastRequest(false);
		});
		res.on('end', function() {
		  	parentvc.log(['loadLuStatus','request ended']);
		  	parentvc.processLastRequest(false);
		});
	});
	req.on('error', function(e) {
		parentvc.log(['loadLuStatus','problem with request:',e.message]);
		parentvc.processLastRequest(e);
	});
	req.end();
};

vc.prototype.processLastRequest = function(error){
	this.log(['processLastRequest','error=',error]);
	if(this.lastRequest['done']!=false){
		this.doNext();
		return ;
	}
	this.log(['processLastRequest','type=',this.lastRequest['type']]);
	switch(this.lastRequest['type']){
		case 'sysinfo':
			this.processLastSysInfo(error);
			break;

		case 'userdata':
			this.processLastUserData(error);
			break;

		case 'staticdata':
			this.processLastStaticData(error);
			break;

		case 'lustatus':
			this.processLuStatus(error);
			break;

	}
	this.lastRequest['done']=true;
	this.doNext();
};

vc.prototype.processLastSysInfo = function(error){
	this.log(['processLastSysinfo','error=',error]);
	if(error!=false){
		this.setState(this.States.SysinfoError);
		this.events.emit('processError','SysInfo',error);
		return false;
	}
	try{
		var si=JSON.parse(this.lastRequest['body']);
	}catch(ecpt){
		si=false;
	}
	this.log(['lastSysInfo','data',si]);
	if(si==false){
		this.setState(this.States.SysinfoError);
		this.events.emit('processError','SysInfo',error);
		return false;
	}
	var oldData=this.data['SysInfo'];
	this.data['SysInfo']=si;
	this.setState(this.States.SysinfoLoaded);
	this.events.emit('sysinfoSuccess',si,oldData);
};

vc.prototype.processLastUserData = function(error){
	this.log(['processLastUserData','error=',error]);
	if(error!=false){
		this.setState(this.States.UserDataError);
		this.events.emit('processError','UserData',error);
		return false;
	}
	try{
		var si=JSON.parse(this.lastRequest['body']);
	}catch(ecpt){
		si=false;
	}
	this.log(['lastUserData','data',si]);
	if(si==false){
		this.setState(this.States.UserDataError);
		this.events.emit('processError','UserData',error);
		return false;
	}
	oldData=this.data['UserData'];
	this.data['UserData']=si;
	this.setState(this.States.UserDataLoaded);
	this.events.emit('userdataSuccess',si,oldData);
};

vc.prototype.processLastStaticData = function(error){
	this.log(['processLastStaticData','error=',error]);
	if(error!=false){
		this.setState(this.States.StaticDataError);
		this.events.emit('processError','StaticData',error);
		return false;
	}
	try{
		var si=JSON.parse(this.lastRequest['body']);
	}catch(ecpt){
		si=false;
	}
	this.log(['processLastStaticData','data',si]);
	if(si==false){
		this.setState(this.States.StaticDataError);
		this.events.emit('processError','StaticData',error);
		return false;
	}
	this.data['StaticData']=si;
	this.setState(this.States.StaticDataLoaded);
	this.events.emit('staticdataSuccess');
};

vc.prototype.processLuStatus = function(error){
	this.log(['processLuStatus','error=',error]);
	if(error!=false){
		this.setState(this.States.LuStatusError);
		this.events.emit('processError','LuStatus',error);
		this.events.emit('lustatusError',error);
		return false;
	}
	try{
		var si=JSON.parse(this.lastRequest['body']);
	}catch(ecpt){
		si=false;
	}
	this.log(['processLuStatus','data',si]);
	if(si==false){
		this.setState(this.States.LuStatusError);
		this.events.emit('processError','LuStatus',error);
		this.events.emit('lustatusDataError',this.lastRequest);
		return false;
	}
	oldData=this.data['LuStatus'];
	this.data['LuStatus']=si;
	this.setState(this.States.LuStatusLoaded);
	this.events.emit('lustatusSuccess',this.data['LuStatus'],oldData);
};

vc.prototype.lastRequestStart = function(type){
	this.lastRequestClean();
	this.lastRequest['type']=type;
};
vc.prototype.lastRequestClean = function(){
	this.lastRequest['status']=false;
	this.lastRequest['headers']=false;
	this.lastRequest['body']=false;
	this.lastRequest['done']=false;
};

vc.prototype.setConfig = function(name,value){
	this.log(['setConfig ',name,value]);
	switch(name){
		case 'ip':
			this.url['IP']=value;
			break;

		case 'timeout':
			this.url['timeout']=value;
			break;

		case 'PollMinimumDelay':
			this.timings['PollMinimumDelay']=value;
			break;

		case 'PollTimeout':
			this.timings['PollTimeout']=value;
			break;

		default:
			this.log(['setConfig','unknown config',name,value]);
			break;
	}
};

vc.prototype.loadData = function(){
	this.loadSysInfo();
};

vc.prototype.doNext = function(){
	this.log(['doNext','state=',this.state]);
	var nvc=this;
	switch(this.state){

		case this.States.New:

			process.nextTick(function(){
				nvc.loadSysInfo();
			});
			break;

		case this.States.SysinfoError:

			console.log('toto sysinfoerror');
			process.exit();
			break;

		case this.States.SysinfoLoaded:

			process.nextTick(function(){
				nvc.loadUserData();
			});
			break;

		case this.States.UserDataError:
			//console.log('toto userdataerror');
			//process.exit();
			break;

		case this.States.UserDataLoaded:

			process.nextTick(function(){
				nvc.loadStaticData();
			});
			break;

		case this.States.StaticDataError:
			//console.log('toto StaticData');
			//process.exit();
			break;

		case this.States.StaticDataLoaded:

			process.nextTick(function(){
				nvc.loadLuStatus();
			});
			break;

		case this.States.LuStatusError:

			process.nextTick(function(){
				nvc.poll();
			});
			break;

		case this.States.LuStatusLoaded:

			process.nextTick(function(){
				nvc.poll();
			});
			break;
	};
};


vc.prototype.pollStart = function(){

};

vc.prototype.poll = function(){
	var params = {
		 'DataVersion' 	: this.data['LuStatus']['DataVersion']
		,'LoadTime'		: this.data['LuStatus']['LoadTime']
		,'MinimumDelay'	: this.timings['PollMinimumDelay']
		,'Timeout'		: this.timings['PollTimeout']
	};

	var pathparams='';
	for(i in params){
		if(pathparams.length>0){
			pathparams+='&';
		}
		pathparams+=i+'='+params[i];
	};
	var nvc=this;
	process.nextTick(function(){
		nvc.loadLuStatus(pathparams);
	});
};

module.exports = vc;
