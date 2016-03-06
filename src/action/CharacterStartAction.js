/**
 * 	占个坑 2016.03.03
 */
CharacterStartAction = ActionState.extend({
	name : "start",
	_system : null,
	
	start : function(unit){
		this._system.addComponent(unit.coms.actions);
	},
	
	end : function(unit){
		this._system.removeComponent(unit.coms.actions);
	},

	init : function(data, template){
		this._super(data, template);
		this._system = SystemUtil.systems.action;
	}
});