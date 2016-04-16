/**
 * 	占个坑 2016.03.03
 */
CharacterStartAction = ActionState.extend({
	name : "start",
	
	//人物进入场景时调用此方法
	start : function(unit){
		SystemUtil.systems.action.addComponent(unit.actions);
		if(unit.coms.move){
			SystemUtil.systems.move.addComponent(unit.coms.move);
		}
		this.update(0, unit, null);
	},
	
	//人物动作重置时调用此方法
	update : function(dt, unit, com){
		unit.actions.current = unit.template.actions.stand;
		unit.actions.current.start(unit);
	},
	
	//人物被清场时调用此方法
	end : function(unit){
		SystemUtil.systems.action.removeComponent(unit.actions);
		if(unit.coms.move){
			SystemUtil.systems.move.removeComponent(unit.coms.move);
		}
	},

	init : function(data, template){
		this._super(data, template);
	}
});