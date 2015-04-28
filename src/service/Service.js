/**
 * 服务组件
 */

Service = {
	
	/**
	 * 初始化单位设置，构建对象
	 */
	initUnitConfig : function(data){
		cc.log("正在初始化动画组件");
		var acts = [normal_att_state1, normal_att_state2, normal_att_state3];
		for(var i in acts){
			Factory.createState(acts[i]);
		}
		cc.log("正在构建动作和技能逻辑列表");
		var act_groups = [normal_att_state_group];
		for(var i in act_groups){
			this.linkAction(act_groups[i]);
		}
		cc.log("正在初始化人物");
		var unit = Factory.createUnit(character);
	},
	
	/**
	 * 构建动作链
	 */
	linkAction : function(data){
		//链式Action
		if(Util.checkArrayNull(data.actions)){
			var pre = Container.getAction(data.actions[0]);
			if(!pre){
				cc.log("linkAction faild~! first action is wrong.");
				return;
			}
			for(var i=1; i<data.actions.length; i++){
				var curr = Container.getAction(data.actions[i]);
				if(!curr){
					cc.log("linkAction faild~! action is wrong.");
					return;
				}
				//如果有key的，就加到可控制子节点中，否则加到直接子节点。
				pre.addNext(curr);
				pre = curr;
			}
		}
		//树式Action，需要由key控制
		if(!Util.checkArrayNull(data.actionNodes)){
			for(var i in data.actionNodes){
				if(!Util.checkNotNull(data.actionNodes[i].name, true)){
					cc.log("linkAction faild~! actionNodes is wrong.");
					return;
				}
				var curr = Container.getAction(data.actionNodes[i].name);
				if(!curr){
					return;
				}
				if(!Util.checkArrayNull(data.actionNodes[i].next)){
					linkNext(data.actionNodes[i].next, curr);
				}
			}
		}
	},
};

Service.linkNext = function(array, parent){
	for(var i in array){
		if(!Util.checkNotNull(array[i].name, true)){
			cc.log("linkAction faild~! linkNext is wrong.");
			return;
		}
		var curr = Container.getAction(array[i].name);
		if(!curr){
			return;
		}
		parent.addNext(curr);
		if(!Util.checkArrayNull(curr.next)){
			linkNext(curr);
		}
	}
};