/**
 * 动作逻辑的基本接口
 */
Action = cc.Class.extend({
    id : 0,
    start : function(unit){},
    
    update : function(dt, unit){},
    
    /**
     * 本次结束时统一调用
     */
    end : function(unit){},
    
    /**
     * 是否满足本次结束条件了
     */
    checkEnd : function(unit){ return false; },
    
    /**
     * 退出状态时统一执行，从内到外逐个执行，一般是资源回收工作
     */
    exit : function(unit){},
    
    /**
     * 获取此动作节点临时存储的变量值
     */
    getCacheValue : function(unit){
    	if(!unit.action.cache[this.id]){
    		unit.action.cache[this.id] = {};
    	}
    	return unit.action.cache[this.id]; 
    },
    
    command : null,
    
    onInput : function(inputEvt, unit){
    	if(!command)return;
    	if(!inputEvt.target){
    		this.command.exec(inputEvt, unit);
    	}
    }
});

/**
 * 输入响应
 */
CommandResponse = cc.Class.extend({
	map : null,
	
	addAction : function(cmd, action){
		if(!map){
			map = {};
		}
		map[cmd] = action;
	},
	
	exec : function(inputEvt, unit){
		inputEvt.target = action;
	}
});