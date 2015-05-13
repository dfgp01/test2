/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 */
ActionState = StateNode.extend({
	state : 0,
	type : 0,
	key : 0,							//通过这个key值来进入这个状态
	frames : null,						//动画帧列表
	//owner : null,						//所有者,类型为Unit
	children : null,					// 树/图结构的下级状态节点
	
	keep : 0,
	effect : null,

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
		
		//播放动画
		if(this.owner.frameIndex < this.frames.length){
			this.owner.body.setSpriteFrame(this.frames[this.owner.frameIndex]);
			this.owner.frameIndex++;
		}else{
			//type分析
			if(this.animateType==0){
				this.nextAct(unit);
			}else if(this.animateType==1){
				this.owner.frameIndex = 0;
			}else{	//animateType==2
				
			}
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