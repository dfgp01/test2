/**
 * ActionState是独立对象，每个unit对应多个，意为动作状态节点
 * ECS模式中，我更倾向于将ActionState看成是System容器
 */
ActionState = cc.Class.extend({
	name : null,
	key : null,					//用于存放在父节点children属性中的key
	children : null,			//子节点，树状结构
	systemList : null,				//系统列表
	state : 0,
	type : 0,
	
	animateSystem : null,	//动画系统组件是必须有的，通常在动画主系统中调用
	coms : null,
	
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
		this.animateSystem.start(unit, this.coms.animate);
		for(var i in this.systemList){
			this.systemList[i].start(unit);
		}
	},
	
	//运行时
	run : function(dt, unit){
		for(var i in this.systemList){
			this.systemList[i].update(dt, unit, this.coms[this.systemList[i].comName]);
		}
		if(unit.actionsCom.endFlag){
			unit.nextAction();
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.systemList){
			this.systemList[i].end(unit);
		}
	}
});