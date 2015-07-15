/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = StateNode.extend({
	state : 0,
	type : 0,
	animateCom : null,				//动画组件是必须要有的
	animateSys : null,
	
	init : function(data){
		this._super(data);
		this.key = data.key;
		this.state = data.state;
	},
	
	//加载时
	start : function(unit){
		unit.actionsCom.currAction = this;
		unit.actionsCom.frameIndex = 0;
		unit.viewCom.sprite.setSpriteFrame(this.animateCom.frames[0]);
	},
	
	run : function(unit, dt){
		for(var i in this.sysList){
			this.sysList[i].update(unit, dt);
		}
	},

	end : function(){},
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
