var
	VM 		= require('./VBVeraMiddleware.js')
	;

VE=new VM();

VE.init({
	 'ip'					: '192.168.81.1'
	,'PollMinimumDelay'		: 10
	,'PollTimeout'			: 10000
});
//VE.vera.ConsoleLog=true;
//VE.ConsoleLog = true;

VE.events.on('onSysInfoChange',function(key,value){
	console.log(['SysInfo',key,value]);
});

VE.events.on('onDeviceDataChange',function(deviceid,key,value,oldvalue){
	console.log(['DeviceData',deviceid,key,value,oldvalue]);
});

VE.events.on('onDeviceServiceVariableChange',function(deviceid,service,variable,value,id){
	console.log(['onDeviceServiceVariableChange',deviceid,service,variable,value,id]);
	var dev=VE.devices[deviceid];
	console.log(['~',dev.getData('name'),service,variable,'=',value]);
});





VE.start();
