/**
 * 服务组件
 */

Service = {
	
	/**
	 * 初始化单位设置，构建对象
	 */
	initCommonUnit : function(data){
		cc.log("正在初始化人物");
		var unit = Factory.createUnit(character);
		
		cc.log("正在初始化动画组件");
		var acts = [normal_att_state1, normal_att_state2, normal_att_state3, skill_1, skill_2, skill_3, skill_4, skill_5];
		for(var i in acts){
			Factory.createActionState(acts[i], unit);
		}
		
		cc.log("正在构建动作和技能逻辑列表");
		var act_groups = [normal_att_state_group, skill_group, act_tree];
		for(var i in act_groups){
			this.linkAction(act_groups[i], unit);
		}
		
		Container.unit = unit;
		
	},
	
	/**
	 * 构建动作链
	 */
	linkAction : function(data, owner){
		//链式Action
		if(!Util.checkArrayNull(data.actions)){
			this.linkForList(data, owner);
			return;
		}
		//树式Action，需要由key控制
		if(!Util.checkArrayNull(data.actionNodes)){
			this.linkForTree(data, owner);
			return;
		}
		cc.log("linkAction faild~!");
		return;
	},
};

Service.linkForList = function(data, owner){
	var pre = owner.actions[data.actions[0]];
	if(!pre){
		cc.log("linkAction faild~! first action is wrong.");
		return;
	}
	for(var i=1; i<data.actions.length; i++){
		var curr = owner.actions[data.actions[i]];
		if(!curr){
			cc.log("linkAction faild~! action is wrong.");
			return;
		}
		//如果有key的，就加到可控制子节点中，否则加到直接子节点。
		pre.addNext(curr);
		pre = curr;
	}
};

Service.linkForTree = function(data, owner){
	for(var i in data.actionNodes){
		if(!Util.checkIsString(data.actionNodes[i].name, true)){
			cc.log("linkAction faild~! actionNodes is wrong.");
			return;
		}
		var curr = owner.actions[data.actionNodes[i].name];
		if(!curr){
			return;
		}
		if(!Util.checkArrayNull(data.actionNodes[i].next)){
			linkNext(data.actionNodes[i].next, curr);
		}
	}
};

Service.linkNext = function(array, parent, owner){
	for(var i in array){
		if(!Util.checkNotNull(array[i].name, true)){
			cc.log("linkAction faild~! linkNext is wrong.");
			return;
		}
		var curr = owner.actions[array[i].name];
		if(!curr){
			return;
		}
		parent.addNext(curr);
		if(!Util.checkArrayNull(curr.next)){
			linkNext(curr);
		}
	}
};