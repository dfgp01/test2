/**
 * 		用于定义公共组件
 * 		Hugo-Fu 2015.11.11	
 */

/**
 * 组件父类
 */
Component = cc.Class.extend({
	name : "component",
	owner : null,		//所属unit
	prev : null,		//前驱指针
	next : null,		//后驱指针
	//克隆对象接口而已
	clone : function(){		cc.log("看到这一句说明你还没重写Component.clone接口 name:" + this.name);	},
	//重置数据
	reset : function(){		cc.log("看到这一句说明你还没重写Component.reset接口 name:" + this.name);		},
	//新的初始化实例
	newInstance : function(){		cc.log("看到这一句说明你还没重写Component.newInstance接口 name:" + this.name);		}
});

/**
 * 组件管理器，提供快速筛选组件
 */
ComponentManager = {
	_viewComs : null,
	moveHead : null,	//头结点是个空心节点，只保留前后指针，后指针指向第一个元素，前指针指向最后一个元素
	
	_pushTolinks : function(head, node){
		if(node.prep==null && node.next==null){
			node.prep = head.prep;
			head.prep.next = node;
			head.prep = node;
		}
	},
	
	deleteNode : function(node){
		if(node.prep==null&&node.next==null){
			node.prep.next = node.next;
			if(node.next!=null){
				node.next.prep = node.prep;
			}
			node.prep = null;
			node.next = null;
		}
	}

	init : function(){
		this.moveHead = new Compoment();
		//this.moveHead.name = "head";
		this.moveHead.prep = this.moveHead;
	},
	
	addMoveNode : function(moveCom){
		_pushTolinks(moveHead, moveCom.node);
	},
	
	getViewHead : function(){
		return this._viewComs.next;
	}
};

/**
 * 	计时组件（Buff持续，技能冷却等地方使用）
 * 		基类只存储总时长
 */
TimerComponent = Component.extend({
	dt : 0,		//用于每隔一段时间触发的
	toal : 0	//总时长
});

/**
 * 矩形交互组件，如会阻碍通行、可拾取、可接触等
 */
CollideComponent = Component.extend({
	name : "collide",
	rect : null,	//矩形框
	maxNum : 0,		//最大碰撞数
	mask : 0		//目标
});