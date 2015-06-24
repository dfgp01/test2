/**
 * 服务组件
 */

Service = {
	
	/**
	 * 初始化单位设置，构建对象
	 */
	initUnit : function(data){
		if(!this.checkCharacterDataRight(data)){
			return;
		}
		
		cc.log("initial unit template......");
		var unitTemplate = Factory.createUnitTemplate(data);
		Container.templates[unitTemplate.name] = unitTemplate;
		
		cc.log("initial animate data......");
		for(var i in data.actions){
			Factory.createActionState(data.actions[i], unitTemplate);
		}
		
		if(!Util.checkArrayNull(data, "actLamda")){
			cc.log("initial action & skill link relationship......");
			for(var i in data.actLamda){
				this.tmpLink(data.actLamda[i], unitTemplate);
			}
		}
		
		
		var act_groups = [normal_att_state_group, skill_group, act_tree];
		for(var i in act_groups){
			this.linkAction(act_groups[i], unit);
		}
		
		if(Util.checkArrayNull(character.baseSkill)){
			return;
		}
		for(var i in character.baseSkill){
			var ac = unit.actions[character.baseSkill[i]];
			unit.actionStateNodes[ac.key] = ac;
		}
		cc.log(Util.iterObj(unit.actionStateNodes));
		
	},
	
	tmpLink : function(data, template){
		var s = data.indexOf(">");
		var pre = data.substring(0, s-1);
		var suf = data.substring(s+1);
		var act = template.actions[pre];
		if(!act){
			cc.log("link action error! action: " + pre + " not found!");
			return;
		}
		linkAct(act, suf);
	}
	
	/**
	 * 构建动作链
	 */
	linkAction : function(data, owner){
		//链式Action
		if(!Util.checkArrayNull(data, "actions")){
			this.linkForList(data, owner);
			return;
		}
		//树式Action，需要由key控制
		if(!Util.checkArrayNull(data, "actionNodes")){
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
		if(!Util.checkIsString(data.actionNodes[i], "name")){
			cc.log("linkAction faild~! actionNodes is wrong.");
			return;
		}
		var curr = owner.actions[data.actionNodes[i].name];
		if(!curr){
			return;
		}
		if(!Util.checkArrayNull(data.actionNodes[i], "next")){
			this.linkNext(data.actionNodes[i].next, curr);
		}
	}
};

Service.linkNext = function(array, parent){
	for(var i in array){
		if(!Util.checkNotNull(array[i], "name")){
			cc.log("linkAction faild~! linkNext is wrong.");
			return;
		}
		var curr = parent.owner.actions[array[i].name];
		if(!curr){
			cc.log("linkAction faild~! linkNext is wrong. action: " + array[i].name + " not found.");
			return;
		}
		parent.addNext(curr);
		if(!Util.checkArrayNull(curr, "next")){
			this.linkNext(curr.next, curr);
		}
	}
};

/**
 * 检查character是否满足可构建必要条件
 */
Service.checkCharacterDataRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "characterName")){
		cc.log("create Character error, lack of necessary data!");
		return false;
	}
	if(!Util.checkNotNull(data, "actions")){
		cc.log("create Character error, must has actions!");
		return false;
	}
}