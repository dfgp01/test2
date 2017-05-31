/**
 * 游戏单位动作，带动画的那种
 */
UnitAction = ActionState.extend({
	state : 0,
	type : 0,
	view : null,
	
	//加载时
	start : function(unit){
		this._super(unit);
		this.view.start(unit.view);
	},
	
	//运行时
	update : function(dt, unit){
		this._super(dt, unit);
		this.view.update(dt, unit.view);
	}
});

var uActVldt = null;
UnitAction.prototype.create = function(data){
	if(!uActVldt){
		//初始化添加验证
		uActVldt = [Validator.create("name", "string", true, 1, 50),
		            Validator.create("view", "object", true)];
		this.addType("unitAction", function(val, label){
			return this.validateObject(val, mvVldt, label);
		});
	}
	if(!Validator.assertType(data, "unitAction", "UnitAction")){
		cc.log("UnitAction.create error.");
		return null;
	}
	var action = new UnitAction();
	action.name = data.name;
	var view = ViewComponent.create(data.view);
	action.view = view;
	UnitAction.build(action, data);
	return action;
};

UnitAction.prototype.build = function(action, data){
	//穷举组件检测
	if(DataUtil.checkNotNull(data.move)){
		action.addComponent(MoveComponent.create(data.move));
	}
	if(DataUtil.checkNotNull(data.command)){
		/*ComponentFactory.addComponent(action,
			ComponentFactory.createCommand(data.command));*/
	}
	if(DataUtil.checkNotNull(data.hit)){
		/*ComponentFactory.addComponent(action,
			ComponentFactory.createHit(data.hit));*/
	}
	return;
};