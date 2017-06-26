/**
 * 并行运行的Action，其中一个子逻辑结束，即主逻辑结束
 */
ParallelActionTypeA = Action.extend({
	actions : null,	//同时运行的逻辑组件
	
	//加载时
	start : function(unit){
		for(var i in this.actions){
			this.actions[i].start(unit);
		}
	},
	
	//运行时
	update : function(dt, unit){
		for(var i in this.actions){
			this.actions[i].update(dt, unit);
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.actions){
			this.actions[i].end(unit);
		}
	},
	
	checkEnd : function(unit){
		for(var i in this.actions){
			if(this.actions[i].checkEnd(unit)){
				return true;
			}
		}
		return false;
	}
});

/**
 * 并行运行的Action，所有子逻辑结束，主逻辑才算结束
 */
ParallelActionTypeB = Action.extend({
	actions : null,	//同时运行的逻辑组件
	
	//加载时
	start : function(unit){
		for(var i in this.actions){
			this.actions[i].start(unit);
		}
	},
	
	//运行时
	update : function(dt, unit){
		for(var i in this.actions){
			if(!this.actions[i].checkEnd(unit)){
				this.actions[i].update(dt, unit);
			}
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.actions){
			this.actions[i].end(unit);
		}
	},
	
	checkEnd : function(unit){
		for(var i in this.actions){
			if(!this.actions[i].checkEnd(unit)){
				return false;
			}
		}
		return true;
	}
});