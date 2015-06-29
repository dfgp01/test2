/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System
 */
ActionState = StateNode.extend({
	state : 0,
	_currUnit : null,
	//animateComSys : null,		//把动画组件单独提出来
	animateCom : null,				//动画组件是必须要有的
	sysList : null,
	
	init : function(data){
		this._super(data);
		this.key = data.key;
		this.state = data.state;
	},
	//加载时
	start : function(unit){
		unit.currAction = this;
		unit.frameIndex = 0;
	},
	
	run : function(unit, dt){
		this._currUnit = unit;
		for(var i in this.sysList){
			this.sysList[i].update(dt);
		}
	},

	end : function(){},
	
	//增加下级节点，判断是直接下级节点还是通过key进入的节点
	addNext : function(state){
		if(Util.checkIsInt(state.key, true) && state.key != 0){
			if(!this.children){
				this.children = {};
			}
			this.children[state.key] = state;
		}
		else{
			this.next = state;
		}
		//this.owner.addToNodes(state);
	}
});

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

SkillAction = ActionState.extend({
	
});
