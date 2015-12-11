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
	
	init : function(data){/**留给子类用的**/},
	
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
		unit.actions.current = this;
		for(var i in this.systemList){
			this.systemList[i].start(unit);
		}
	},
	
	//运行时
	run : function(dt, unit){
		for(var i in this.systemList){
			this.systemList[i].update(dt, unit, this.coms[this.systemList[i].comName]);
		}
		//临时措施，日后完善，可能会放到 ActionRunSystem中
		if(unit.actions.endFlag){
			this.end(unit);
			if(unit.actions.next != null){
				unit.actions.next.start(unit);
				//还原为空状态，原因你懂，不信的话把这句注释看看。
				unit.actions.next = null;
			}
			else if(this.children && this.children[Constant.DIRECT_CHILDNODE]){
				this.children[Constant.DIRECT_CHILDNODE].start(unit);
			}
			else{
				unit.actions.names.stand.start(unit);
			}
			unit.actions.endFlag = false;
		}
	},

	//结束时
	end : function(unit){
		for(var i in this.systemList){
			this.systemList[i].end(unit);
		}
	}
});