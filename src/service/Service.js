/**
 * 公共服务组件，提供大部分常用的业务接口
 * edit by Hugo-Fu 2015.06.26
 */

Service = {

	/**
	 * 游戏经过时间递增
	 */
	gameTimeAfter : function(dt){
		Container.gameTime += dt;
	},
	
	/**
	 * 得到所有单位列表
	 */
	getAllObjects : function(){
		return Container.objList;
	},
	
	/**
	 * 	从指定模板中创建新对象
	 */
	createObj : function(tempName){
		var tmp = Container.templates[tempName];
		if(tmp){
			return tmp.getNewInstance();
		}else{
			cc.log("template: " + tempName + " not found!");
			return null;
		}
	},
	
	/**
	 * 创建一个新单位，指定模板和组号
	 */
	createUnit : function(tempName, group){
		var unit = this.createObj(tempName);
		if(unit != null){
			Container.unitList.push(unit);
			unit.group = group;
		}
		return unit;
	},
	
	/**
	 * 从对象池中获得对象引用
	 */
	popUnitFromPool : function(){
		return GameObjPool.popUnit();
	},
	
	/**
	 * 初始化单位设置，构建对象
	 */
	initUnitTemplate : function(data){
		if(!this.checkCharacterDataRight(data)){
			return;
		}
		
		cc.log("initial unit template......");
		var unitTemplate = Factory.createUnitTemplate(data);
		Container.templates[unitTemplate.name] = unitTemplate;
		
		cc.log("initial actions data......");
		for(var i in data.actions){
			Factory.createActionState(data.actions[i], unitTemplate);
		}
		var firstActName = data.actions[0].name;
		unitTemplate.actionsCom.firstAct = unitTemplate.actionsCom.actions[firstActName];
		
		if(!Util.checkArrayNull(data, "actLamda")){
			cc.log("initial action & skill link relationship......");
			for(var i in data.actLamda){
				cc.log("  initial : " + data.actLamda[i]);
				this.linkForExpress(null, data.actLamda[i], unitTemplate);
			}
		}
	},
	
	/**
	 * 初始化玩家配置
	 */
	initPlayer : function(){
		if(!Util.checkIsString(playerData, "characterName")){
			return;
		}
		Container.player.unit = Service.createUnit(playerData.characterName, Constant.UnitGroup.PLAYER);
	},
	
	/**
	 * 获取玩家信息
	 */
	getPlayer : function(){
		return Container.player;
	},
	
	/**
	 * 全局数据容器，存储所有游戏对象，用于数据共享
	 */
	Container : {

			gameTime : 0,	//游戏时间

			//玩家数据
			player : {
				character : null,
				score : 0
			},

			frames : {},		//存储帧
			actions : {},		//存储动作组件
			data : {},			//存储原始数据

			objList : [],			//存储所有单位
			groups : [],		//存储单位组信息，里面是个二维数组，每元素是一个组，里面存储一个list

			templates : {}		//存储已初始化的原始数据的模板
	},
	
	/**
	 * 全局游戏设置
	 */
	GameSetting : {

			framerate : 60,				//cocos2d默认fps是60
			logicTick : 0.033,			//逻辑帧fps:30
			animateTick : 0.041,		//动画帧fps:24

			gravity : -2,					//一般重力，一些单位可设置自定义重力
			maxGravity : -10,			//最大引力

			//单位移动时，Y轴与X轴的相对速度比
			unitSpeedFactor : {
				walkX : 1,
				walkY : 0.618,
				//runX : 2,
				//runY : 1.6,
				airX : 0.9,
				airY : 0.8
			}
	}

};

/**
 * 检查character是否满足可构建必要条件
 */
Service.checkCharacterDataRight = function(data){
	if(!Util.checkNotNull(data) || !Util.checkIsString(data, "name")){
		cc.log("create Character error, lack of necessary data!");
		return false;
	}
	if(!Util.checkIsArray(data, "actions")){
		cc.log("create Character error, must has actions!");
		return false;
	}
	return true;
};

/**
 * 根据lamda表达式构建动作链，最初版本
 * ( )括号=子表达式，里面只能填单向链，不支持嵌套表达式
 * { }花括号=分支，里面只能填多个act名，不支持嵌套表达式，不支持后续，意味着只能做表达式终点
 */
Service.linkForExpress = function(node, strExpress, template){
	//检查是否含有子表达式"[ ]"
	if(strExpress.charAt(0)=="["){
		var end = strExpress.indexOf("]");
		//分离子表达式和重复计数器，例如：[normalAtk1>normalAtk2,3]
		var prefix = strExpress.substring(1, end).split(",");
		var subExpress = "";
		var repeatCount = 0;
		subExpress = prefix[0];
		repeatCount = prefix[1];

		//子表达式内链处理
		var actNameArr = subExpress.split(">");
		var actList = [];
		for(var i in actNameArr){
			var act = template.actionsCom.actions[actNameArr[i]];
			if(!act){
				cc.log("action: " + actNameArr[i] + " not found! please check the lamda express.");
				return;
			}
			actList.push(act);
		}
		//完成子表达式内连接
		for(var i=0; i<actList.length-1; i++){
			this.linkNode(actList[i], actList[i+1]);
		}
		
		//将子表达式内的头节点和上一尾节点连接起来
		this.linkNode(node, actList[0]);
		
		//重复计数器处理
		if(repeatCount > 0){
			//alert(repeatCount);
		}
		
		//截取子表达式外 ">" 后的表达式
		var suffix = strExpress.substring(end+2);
		//将尾节点作为下一次连接的头节点
		this.linkForExpress(actList[actList.length-1], suffix, template);
	}
	//检查是否含有分支节点表达式"{ }"
	else if(strExpress.charAt(0)=="{"){
		var end = strExpress.indexOf("}");
		var actNameArr = strExpress.substring(1, end).split(",");
		for(var i in actNameArr){
			var act = template.actionsCom.actions[actNameArr[i]];
			if(!act){
				cc.log("action: " + actNameArr[i] + " not found! please check the lamda express.");
				return;
			}
			this.linkNode(node, act);
		}
		return;
	}
	//剩下的就是一个action名了
	else{
		var s = strExpress.indexOf(">");
		var act;
		if(s==-1){
			//到达结尾
			act = template.actionsCom.actions[strExpress];
			if(!act){
				cc.log("action: " + strExpress + " not found! please check the lamda express.");
				return;
			}
			this.linkNode(node, act);
			return;
		}
		var actName = strExpress.substring(0, s);
		act = template.actionsCom.actions[actName];
		if(!act){
			cc.log("action: " + actName + " not found! please check the lamda express.");
			return;
		}
		this.linkNode(node, act);
		var suffixStr = strExpress.substring(s+1);
		this.linkForExpress(act, suffixStr, template);	//继续递归
	}
};

Service.linkNode = function(node1, node2){
	if(node1==null){
		return;
	}
	node1.addChild(node2);
}