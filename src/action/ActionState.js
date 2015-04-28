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

	init : function(data){
		this._super(data);
		this.key = data.key;
		this.state = data.state;
	},
	//加载时
	start : function(){
		this.owner.currAction = this;
		this.owner.frameIndex = 0;
	},
	run : function(dt){
		if(this.owner.frameIndex > this.frames.length-1){
			//unit.currState.nextAct();
			this.owner.frameIndex = 0;
			return;
		}
		this.owner.body.setSpriteFrame(this.frames[this.owner.frameIndex]);
		this.owner.frameIndex++;
	},
	startWithUnit : function(unit){
		unit.currAction = this;
		unit.frameIndex = 0;
	},
	runWithUnit : function(unit){
		if(unit.frameIndex > unit.length-1){
			//unit.currState.nextAct();
			//unit.frameIndex = 0;
			return;
		}
		unit.body.setSpriteFrame(this.frames[unit.frameIndex]);
		unit.frameIndex++;
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

AttackActionState = ActionState.extend({
	keyFrame : 0,
	hitBox : null,
	hitState : null,
	ctor : function(data){
		this._super(data);
	},
	init : function(data){
		this._super(data);
		this.hitBox = data.hitBox;
		this.keyFrame = data.keyFrame;
	}
});