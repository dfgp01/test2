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
	
	/*init : function(data){
		this._super(data);
		this.key = data.key;
		this.state = data.state;
		this.systemList = [];
	},*/

	/**
	 * 插入一个子系统，可指定优先级
	 * @param system
	 * @param priority
	 */
	addSystem : function(system){
		for(var i in this.systemList){
			if(system.priority > this.systemList[i].priority){
				this.systemList.splice(i, 0, system);
				return;
			}
		}
		//上面的循环未return时，说明system的优先级是最小的，要补加到列表尾
		this.systemList.push(system);
	},
	
	/**
	 * 	新旧系统替换，指定要去除的旧系统名字和新系统对象
	 *  如替换失败，则将新系统添加到列表中
	 * @param oldName
	 * @param newSystem
	 */
	replaceSystem : function(oldName, newSystem){
		for(var i in this.systemList){
			if(this.systemList[i].name == oldName){
				this.systemList[i] = newSystem;
				return;
			}
		}
		//上面的循环未return时，说明没发生替换，要补加新系统到列表
		this.systemList.push(newSystem);
	},

	findSystemByName : function(name){
		for(var i in this.systemList){
			if(this.systemList[i].name == name){
				return this.systemList[i];
			}
		}
		cc.log("action findSystemByName error~! system-name:[" + name + "] not found.");
		return null;
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
		this.animateSystem.start(unit, this.coms.animate);
		for(var i in this.systemList){
			this.systemList[i].start(unit);
		}
	},
	
	run : function(dt, unit){
		for(var i in this.systemList){
			this.systemList[i].update(dt, unit, this.coms[this.systemList[i].comName]);
		}
		if(unit.actionsCom.endFlag){
			unit.nextAction();
		}
	},

	end : function(unit){
		for(var i in this.systemList){
			this.systemList[i].end(unit);
		}
	}
});