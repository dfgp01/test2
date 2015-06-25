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
	
	tmpLink : function(node, strExpress, template){
		//检查是否含有子表达式"( )"
		if(strExpress.charAt(0)=="("){
			
		}
		//检查是否含有分支节点表达式"{ }"
		else if(strExpress.charAt(0)=="{"){
			
		}
		//剩下的就是一个action名了
		else{
			var s = strExpress.indexOf(">");
			var actName = strExpress.substring(0, s-1);
			var suffixStr = strExpress.substring(s+1);
			var act = template.actions[actName];
			if(!act){
				cc.log("action: " + pre + " not found! please check the lamda express.");
				return;
			}
			
		}
		linkAct(act, suf);
	}
	
	/**
	 * 构建动作链（旧）
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
};

/**
 * 根据lamda表达式构建动作链
 */
Service.linkForExpress = function(node, strExpress, template){
	//检查是否含有子表达式"( )"
	if(strExpress.charAt(0)=="("){
		var end = strExpress.indexOf(")");
		if(end==-1){
			cc.log("exp: ')' not found! please check the lamda express.");
			return;
		}
		var subExpress = strExpress.subString(1, end-1);
		var actNameArr = subExpress..split(">");
		if(Util.checkArrayNull(actNameArr)){
			cc.log("exp: ( ) trans error! please check the lamda express.");
			return;
		}
		var actList = [];
		for(var i in actNameArr){
			var act = template.actions[actNameArr[i]];
			if(!act){
				cc.log("action: " + pre + " not found! please check the lamda express.");
				return;
			}
			//this.linkAct(node, act);
			actList.push(act);
		}
		for(var i=0; i<actList.length-1; i++){
			this.linkAct(actList[i], actList[i+1]);
		}
		//将头节点和上一尾节点连接起来
		this.linkAct(node, actList[0]);
	}
	//检查是否含有分支节点表达式"{ }"
	else if(strExpress.charAt(0)=="{"){
		var end = strExpress.indexOf("}");
		if(end==-1){
			cc.log("exp: '}' not found! please check the lamda express.");
			return;
		}
		var actNameArr = strExpress.subString(1, end-1).split(",");
		if(Util.checkArrayNull(actNameArr)){
			cc.log("exp: {} trans error! please check the lamda express.");
			return;
		}
		for(var i in actNameArr){
			var act = template.actions[actNameArr[i]];
			if(!act){
				cc.log("action: " + pre + " not found! please check the lamda express.");
				return;
			}
			this.linkAct(node, act);
		}
		return;
	}
	//剩下的就是一个action名了
	else{
		var s = strExpress.indexOf(">");
		if(s==-1){
			//到达尾部，可以结束了
			return;
		}
		var actName = strExpress.substring(0, s-1);
		var suffixStr = strExpress.substring(s+1);
		var act = template.actions[actName];
		if(!act){
			cc.log("action: " + pre + " not found! please check the lamda express.");
			return;
		}
		this.linkAct(node , act);
		this.linkForExpress(act, suffixStr, template);	//继续递归
	}
};

Service.linkAct = function(node1, node2){
	if(node1==null){
		return;
	}
	var key = node2.getKey();
	if(Util.checkNotNull(node1.children) && node1.children[key]){
		cc.log("node: " + node1.name + " key: " + key + " has exists, please check the lamda express.");
		return;
	}
	node1.addChild(node2);
}