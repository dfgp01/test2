/**
 * 抽象的游戏对象
 */
GameObject = cc.Class.extend({
	id : null,			//自增序列号
	name : null,		//名称
	state : 0,			//状态值，身处的状态区间
	actions : null,		//action组件是必须有的，不需要放在propertys中
	view : null,		//同上
	collide : null,		//同上
	owner : null,		//同上
	propertys : null,	//其他组件列表，map<name, com>型存储方式
	template : null		//每个单位都应该有一个模板的引用，因为里面存放了默认的数值
});

/**
 *  单位模板，相当于单位的制造工厂，存储某种单位类型的初始化数据
 *  因为每个模板对应一种单位，每种单位特征各不相同，所以应该有独立的对象池，以免和其他混淆，发生错误。
 *  edit by Hugo-Fu 2015.10.05
 *  update by Hugo-Fu 2017.01.09
 */
GameObjectTemplate = cc.Class.extend({

	availableList : null,	//对象池
	name : null,
	frame : null,				//初始frame
	featureCode : 0,

	actions : null,		//动作集合
	propertys : null,	//属性集合
	
	nextId : 1,

	init : function(data){
		this.name = data.name;
		this.availableList = [];
		this.propertys = {};
		this.actions = {};
		this.frame = EngineUtil.getFrame(data.frame);
	}
});