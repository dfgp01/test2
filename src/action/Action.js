/**
 * 动作逻辑的基本接口
 */
Action = cc.Class.extend({
    id : 0,
    start : function(unit){},
    update : function(dt, unit){},
    end : function(unit){},
    isEnd : function(unit){ return false; },
    
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