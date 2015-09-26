var events = require('events');

function VBVeraDevice(id){
	this.id=id;
	this.data={};
	this.services={};
	this.servicesi={};
}

VBVeraDevice.prototype.events = new events.EventEmitter();

VBVeraDevice.prototype.getId = function(){
	return this.id;
};

VBVeraDevice.prototype.getUserDataItemList = function(){
	return ['name','device_type'];
};

VBVeraDevice.prototype.getStateFieldList = function(){
	return [
		'service','variable','value','id'

	];
};

VBVeraDevice.prototype.getData = function(key){
	if(typeof(this.data[key])=='undefined'){
		return nul;
	}
	return this.data[key];
};

VBVeraDevice.prototype.setData = function(key,value){
	if(
			typeof(this.data[key])=='undefined'
		||	this.data[key]!==value
	){
		lastvalue=this.data[key];
		this.data[key]=value;
		this.events.emit('onDataChange',this,key,value,lastvalue);
	}
};

VBVeraDevice.prototype.hasService = function(name){
	if(typeof(this.services[name])=='undefined'){
		return false;
	}
	return true;
};

VBVeraDevice.prototype.setStateData = function(data){
	if(
			typeof(data.variable)=="undefined"
		|| 	typeof(data.service)=='undefined'
		||	typeof(data.value)=="undefined"
	){
		return false;
	}
	var newData=false;

	if(
		typeof(this.services[data.service])=='undefined'
	){
		this.services[data.service]={};
		this.servicesi[data.service]={};
		newData=true;
	}

	if(
			newData==true
		|| 	typeof(this.services[data.service][data.variable])=='undefined'
		||	this.services[data.service][data.variable] != data.value
	){
		this.services[data.service][data.variable]=data.value;
		if(typeof(data.id)!='undefined'){
			this.servicesi[data.service][data.variable]=data.id;
		}
		newData=true;
	}

	if(typeof(data.id)=='undefined'){
		data.id=null;
	}
	if(newData){
		//console.log('emitting onServiceVariableChange '+this.id);
		this.events.emit('onServiceVariableChange',this,data.service,data.variable,data.value,data.id);
	}
};

module.exports = VBVeraDevice;
