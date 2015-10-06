

/**
 *  对象管理器
 */
GameObjPool = {
	step : 5,				//create obj num when pool is full
	count  : 2,
	
	markList : [],
	unitList : [],
	
	addUnit : function(unit){
		this.unitList.push(unit);
	},
	
	popUnit : function(){
		if(this.unitList.length > 0){
			return this.unitList.pop();
		}
		return null;
	},

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

