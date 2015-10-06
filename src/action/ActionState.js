/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = cc.Class.extend({
	name : null,
	key : null,					//用于存放在父节点children属性中的key
	children : null,			//子节点，树状结构
	sysList : null,				//系统列表
	state : 0,
	type : 0,
	animateSystem : null,	//动画组件是必须有的
	
	init : function(data){
		this._super(data);
		this.key = data.key;
		this.state = data.state;
	},
	
	addSystem : function(system){
		if(this.sysList == null){
			this.sysList = [];
		}
		this.sysList.push(system);
	},
	
	//设置直接下一个节点，需要改
	addChild : function(node){
		if(this.children==null){
			this.children = {};
		}
		if(this.children[node.key]){
			cc.log("key: " + node.key + " has exists in parent node. parent:"+this.name+" child:"+node.name);
		}
		this.children[node.key] = node;
	},
	
	//加载时
	start : function(unit){
		unit.actionsCom.currAction = this;
		unit.actionsCom.frameIndex = 0;
		unit.actionsCom.endFlag = false;
		unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[0]);
		for(var i in this.sysList){
			this.sysList[i].start(unit);
		}
	},
	
	run : function(unit, dt){
		for(var i in this.sysList){
			this.sysList[i].update(unit, dt);
		}
		if(unit.actionsCom.endFlag){
			unit.nextAction();
		}
	},

	end : function(unit){
		for(var i in this.sysList){
			this.sysList[i].end(unit);
		}
	}
});

/**
 * 暂时废弃，改用ECS模式
 */
AttackAction = ActionState.extend({
	keyFrame : 0,
	hitBox : null,
	//hitActType : 0,
	//targetType : 0,		数据定义后，然后根据逻辑生产组件，实体不一定要保留这些属性
	init : function(data){
		this._super(data);
		this.hitBox = data.hitBox;
		this.keyFrame = data.keyFrame;
	},
	
	run : function(unit, dt){
		this._super(unit, dt);
		if(this.collide(unit)){
			this.effect.run(unit);
		}
	},
	
	collide : function(unit){
		if(this.targetType==1){
			//.......
		}else if(this.targetType==2){
			//.......
		}
		return false;
	}
});
