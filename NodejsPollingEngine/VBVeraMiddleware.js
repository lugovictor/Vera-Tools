var events = require('events');
var VBVeraDevice = require('./VBVeraDevice.js');
var VBVeraSimplePolling = require('./VBVeraSimplePolling.js');

function ve(){
	this.async = false;
  this.ConsoleLog=false;
	this.data = {};
	this.devices = {};
	this.vera 	= new VBVeraSimplePolling();
	this.events = new events.EventEmitter();
}

ve.prototype.emitted={};

ve.prototype.log = function(data){
	if(this.ConsoleLog===true){
		console.log(JSON.stringify(data));
	}
};

ve.prototype.start = function(){
	this.data = {};
	this.vera.start();
};
ve.prototype.init=function(vspdetails){
	this.emmited={};

	this.vera.init(vspdetails);
	var vx=this;
	this.vera.events.on('stateChange',function(newstate,oldstate){
		vx.onStateChange(newstate,oldstate);
	});
	this.vera.events.on('processError',function(datatype,error){
		vx.onProcessError(datatype,error);
	});

	this.vera.events.on('lustatusSuccess',function(newdata,olddata){
		vx.onSuccess('lustatus',newdata,olddata);
	});
	this.vera.events.on('lustatusError',function(newdata,olddata){
		vx.onError('lustatus',newdata,olddata,false);
	});
	this.vera.events.on('lustatusDataError',function(newdata,olddata){
		vx.onError('lustatus',false,false,error);
	});

	this.vera.events.on('sysinfoSuccess',function(newdata,olddata){
		vx.onSuccess('sysinfo',newdata,olddata);
	});
	this.vera.events.on('sysinfoError',function(newdata,olddata){
		vx.onError('sysinfo',newdata,olddata,false);
	});
	this.vera.events.on('sysinfoDataError',function(newdata,olddata){
		vx.onError('sysinfo',false,false,error);
	});


	this.vera.events.on('userdataSuccess',function(newdata,olddata){
		vx.onSuccess('userdata',newdata,olddata);
	});
	this.vera.events.on('userdataError',function(newdata,olddata){
		vx.onError('userdata',newdata,olddata,false);
	});
	this.vera.events.on('userdataDataError',function(newdata,olddata){
		vx.onError('userdata',false,false,error);
	});

	this.vera.events.on('staticdataSuccess',function(newdata,olddata){
		vx.onSuccess('staticdata',newdata,olddata);
	});
	this.vera.events.on('staticdataError',function(newdata,olddata){
		vx.onError('staticdata',newdata,olddata,false);
	});
	this.vera.events.on('staticdataDataError',function(newdata,olddata){
		vx.onError('staticdata',false,false,error);
	});
};

ve.prototype.onStateChange = function(newstate,oldstate){
	this.log(['onStateChange',oldstate,'->',newstate]);
};
ve.prototype.onProcessError = function(datatype,error){
	this.log(['onProcessError',datatype,error]);
};
ve.prototype.onSuccess = function(datatype,newdata,olddata){
	switch(datatype){

		case 'sysinfo':
			this.changeSysInfo(newdata,olddata);
			break;

		case 'userdata':
			this.changeUserData(newdata,olddata);
			break;

		case 'staticdata':
			break;

		case 'lustatus':
			this.changeLuStatus(newdata,olddata);
			break;

		default:
			this.log(['onSuccess-UnknownDatatype',datatype]);
			process.exit(0);
			break;
	}
};
ve.prototype.onError = function(datatype,newdata,olddata,error){
	this.log(['onError',datatype,newdata,olddata]);
};

ve.prototype.changeSysInfo = function(newdata,olddata){
	//this.log(['Sysinfo','=',newdata]);
	if(typeof(this.data.SysInfo)=="undefined"){
		this.data.SysInfo=newdata;
		for(var i in this.data.SysInfo){
			this.events.emit('onSysInfoChange',i,this.data.SysInfo[i]);
		}
	}else{
		for(var i in newdata){
			if(
					typeof(this.data.SysInfo[i])=='undefined'
				|| 	this.data.SysInfo[i]!=newdata[i]
			){
				this.data.SysInfo[i]=newdata[i];
				this.events.emit('onSysInfoChange',i,this.data.SysInfo[i]);
			}
		}
	}
};

ve.prototype.changeUserData = function(newdata,olddata){
	if(typeof(newdata)=='undefined' || newdata==null || newdata==false){
		return ;
	}
	var vx=this;
	if(typeof(newdata.devices)!='undefined'){
		for(i in newdata.devices){
			if(ve.async){
				setImmediate(function(){
					vx.processDeviceData(newdata.devices[i]);
				});
			}else{
				this.processDeviceData(newdata.devices[i]);
			}
		}
	}
	//console.log(newdata);
	//process.exit(1);
};

ve.prototype.processDeviceData = function(data){
	if(typeof(data.id)=='undefined'){ return false; }
	var newDevice=false;
	if(typeof(this.devices[data.id]) == 'undefined'){
		var newdev=new VBVeraDevice(data.id);
		var vx=this;
		newdev.events.on('onDataChange',function(deviceobj,key,value,oldvalue){
			var cvar=deviceobj.getId()+'-'+key;
			if(typeof(vx.emmited)=='undefined'){										vx.emmited={}; }
			if(typeof(vx.emmited.datachange)=='undefined'){				vx.emmited.datachange={}; }
			if(
						typeof(vx.emmited.datachange[cvar])!='undefined'
				&&	vx.emmited.datachange[cvar]===value
			){
				return ;
			}
			vx.emmited.datachange[cvar]=value;
			vx.events.emit('onDeviceDataChange',deviceobj.getId(),key,value,oldvalue);
		});

		newdev.events.on('onStateChange',function(deviceobj,state,variable,value,oldvalue){
			var cvar=deviceobj.getId()+'-'+state+'-'+variable;
			if(typeof(vx.emmited)=='undefined'){										vx.emmited={}; }
			if(typeof(vx.emmited.statechange)=='undefined'){				vx.emmited.statechange={}; }
			if(
						typeof(vx.emmited.statechange[cvar])!='undefined'
				&&	vx.emmited.statechange[cvar]===value
			){
				return ;
			}
			vx.emmited.statechange[cvar]=value;
			vx.events.emit('onDeviceStateChange',deviceobj.getId(),state,variable,value,oldvalue);
		});

		newdev.events.on('onServiceVariableChange',function(deviceobj,service,variable,value,id){
			var cvar=deviceobj.getId()+'-'+service+'-'+variable;
			if(typeof(vx.emmited)=='undefined'){															vx.emmited={}; }
			if(typeof(vx.emmited.servicevariablechange)=='undefined'){				vx.emmited.servicevariablechange={}; }
			if(
						typeof(vx.emmited.servicevariablechange[cvar])!='undefined'
				&&	vx.emmited.servicevariablechange[cvar]===value
			){
				return ;
			}
			vx.emmited.servicevariablechange[cvar]=value;
			vx.events.emit('onDeviceServiceVariableChange',deviceobj.getId(),service,variable,value,id);
		});

		this.devices[data.id]=newdev;

		if(newDevice==false){
			this.events.emit('onNewDeviceStart',this.devices[data.id].getId());
			newDevice=true;
		}
	}

	var dev=this.devices[data.id];

	var list=dev.getUserDataItemList();
	for(i in list){
		if(typeof(data[list[i]])!='undefined'){
			dev.setData(list[i],data[list[i]]);
		}
	}
	if(typeof(data['states'])!='undefined'){
		for(var i in data['states']){
			dev.setStateData(data['states'][i]);
		}
	}

	//console.log(['*','**','***']);
	//process.exit(33);

	if(newDevice){
		this.events.emit('onNewDeviceEnd',this.devices[data.id].getId());
	}
};

ve.prototype.changeLuStatus = function(data,old){
	if(typeof(data.devices)!='undefined'){
		for(i in data.devices){
			if(typeof(data.devices[i].id)!='undefined'){
				this.updateDevice(data.devices[i]);
			}
		};
	}
};

ve.prototype.updateDevice = function(data){
	//console.log('-=======================-');
  //console.log(data);
	if(typeof(data.states)!='undefined'){
		for(i in data.states){
			//console.log('*************');
			this.devices[data.id].setStateData(data.states[i]);
		}
	}

	//jobs
	//pending jobs
};

module.exports = ve;
