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
	
	coms : null,
	
	init : function(data){
		this.coms = {};
		this.systemList = [];
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
		//这一句必须要有
		unit.actions.endFlag = false;
		unit.actions.current = this;
		for(var i in this.systemList){
			this.systemList[i].start(unit, this.coms[this.systemList[i].name]);
		}
		//动画逻辑
		if(this.coms.animate){
			var animate = this.coms.animate;
			var com = Service.getInstance("animateComplex");
			if(com==null){
				com = new AnimateComplexComponent();
			}
			ComponentUtil.attr(com, {gameObj:unit,animate:animate});
			GameUtil.systems.sys.animate.addComponent(com);
			//AnimateRunSystemNEW.addComponent(com);
		}
		
	},
	
	//运行时
	run : function(dt, unit){
		for(var i in this.systemList){
			this.systemList[i].update(dt, unit, this.coms[this.systemList[i].name]);
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.systemList){
			this.systemList[i].end(unit);
		}
	}
});