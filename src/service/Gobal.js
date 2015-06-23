/**
 * 全局数据
 */
GobalSetting = {
	framerate : 60,
	tick : 0.0333,
	
	//动画帧延迟时间，单位秒
	frameDelayTime : 0.0333,	//fps:30
	
	//一般重力，一些单位可设置自定义重力
	gravity : -2,
	
	//最大下落速度
	maxGravity : -10
};

/**
 *  对象池
 */
Pool = {
	step : 5,				//create obj num when pool is full
	count  : 2,
	
	markList : [],
	unitList : [],
	
	addMark : function(arr){
		this.markList.push(arr);
	},

	getMark : function(){
		if(this.markList.length > 0){
			return this.markList.pop();			//从最后一个元素开始移除
			//return this.markList.shift();			//从第一个元素开始移除
		}else{
			var array = [];
			this.addMark(array);
			return array;
		}
	},
	
	getObject : function(objName){

		var sub_pool = this[objName];
		var index = -1;
		
		if(sub_pool == undefined || sub_pool == null){
			return null;
		}
		
		for(var i=0; i<sub_pool.length; i++){
			if(!sub_pool[i].isActive){
				index = i;
				return sub_pool[i];
			}
		}
		return null;
	},

	addToPool : function(objName, clz){
		var sub_pool = this[objName];
		if(sub_pool == undefined || sub_pool == null){
			this[objName] = [];
		}
		for(var i=0; i<step; i++){
			var obj = new clz();
			obj.isActive = false;
			sub_pool.push(obj);
		}
		return;
	}
};

/**
 * 组件管理器，存储所有游戏对象，用于数据共享
 */
Container = {
		
		frames : {},			//存储帧
		actions : {},			//存储动作组件
		data : {},			//存储原始数据
		unitList : [],		//存储所有单位
		groups : [],		//存储单位组信息，里面是个二维数组，每元素是一个组，里面存储一个list
		
		//跟据字符串数组查找对应的实体，并封装成list，不建议直接调用此方法
		getList : function(names, objName){
			var list = [];
			for(var i=0; i<names.length; i++){
				var obj = this.getOne(names[i], objName);
				if(obj){
					list.push(obj);
				}
			}
			if(list.length == 0){
				return null;
			}else{
				return list;
			}
		},
		
		//根据指定名称从二级列表中取得对象，不建议直接调用此方法，可用下面的getXXX方法
		getOne : function(name, objName){
			if(Util.checkNotNull(this[objName][name])){
				return this[objName][name];
			}
			cc.log("Container " + objName + ": '" +  name + "' not found~!");
			return null;
		},
		
		getFrame : function(frmName){
			return this.getOne(frmName,"frames");
		},
		
		/*getFrames : function(frmNames){
			if(!frmNames || !frmNames.length || frmNames.length == 0){
				log += "getFrames(arg) arg must array type~!";
				return null;
			}
			return this.getList(frmNames, "frames");
		},*/
		
		getAction : function(actName){
			return this.getOne(actName,"actions");
		},
		
		/*getActions : function(actNames){
			if(!actNames || !actNames.length || actNames.length == 0){
				log += "getActions(arg) arg must array type~!";
				return null;
			}
			return this.getList(actNames, "actions");
		},*/
		
		getProperty : function(proName){
			return this.getOne(proName,"property");
		}
		
		//检查容器内的对象是否存在
		/*checkIfExists : function(name, objName){
			var obj = this[objName][name];
			if(!obj){
				log += "Container." + objName + "." + name + " not found \n";
				return false;
			}
			return true;
		},*/

};


//事件，暂时没用到，用cocos的
Event = {
	container : [],
	dispatcher : function(name, eventSource, eventObj){
		var list = this.container[name];
		if(list != undefined && list.length > 0){
			var isNext = true;
			var i = 0;
			//逐个执行监听表内的函数
			do{
				isNext = list[i](eventSource, eventObj);
				i++;
			}while(isNext);
		}
		return;
	},
	addEventListener : function(name, callback, priority){
		var list = this.container[name];
		if(list == undefined || list == null){
			list = [];
		}
		if(list.length == 0){
			list.push(callback);
		}else{
			for(var i=0; i<list.length; i++){
				//根据priority添加
			}
		}
	},
	//移除指定对象的所有监听器
	removeAllListener : function(obj){
		
	},
	//移除监听器和它的所有函数
	removeListener : function(obj, name){
		
	},
	//从监听器里去除一个函数，注意和上面的区别
	removeFromListener : function(obj, name, callback){
		
	}
};