/**
 * 	角色的动作状态管理器
 */
CharacterActionStateManager = ActionStateManager.extend({
	
	boot : function(unit){
		//加入到活动列表
		ObjectManager.propertys.addActionsNode(unit.actions);
		//加入到渲染列表
		ObjectManager.propertys.addViewNode(unit.view);
	},
	
	start : function(unit){
		var actions = unit.actions;
		if(unit.state == Constant.STATE_IDLE){
			if(unit.view.z > 0){
				actions.current = ActionID.CHARACTER_AIR;
			}else{
				actions.current = ActionID.CHARACTER_STAND;
			}
		}
		this.getAction(actions.current).start(unit);
	},
	
	exit : function(unit){
		//摘除动作节点
	}
});