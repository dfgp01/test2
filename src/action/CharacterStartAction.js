/**
 * 	占个坑 2016.03.03
 */
CharacterStartAction = ActionState.extend({
	name : "start",
	_actionSys : null,
	_motionSys : null,
	
	start : function(unit){
		//人物进场初始化时调用此方法
		this._actionSys.addComponent(unit.actions);
		//this._motionSys.addComponent(unit.coms.motion);
		this.update(0, unit, null);
	},
	
	update : function(dt, unit, com){
		//人物动作重置时调用此方法
		unit.template.actions.stand.start(unit);
	},
	
	end : function(unit){
		//人物被清场时调用此方法
		this._system.removeComponent(unit.coms.actions);
	},

	init : function(data, template){
		this._super(data, template);
		this._actionSys = SystemUtil.systems.action;
		this._motionSys = SystemUtil.systems.motion;
	}
});