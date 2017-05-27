/**
 * 		定义游戏单位中的各种属性组件
 * 		Hugo-Fu 2017.01.06
 */

/**
 * 	GameObject/Unit 对象属性集抽象类
 */
Property = Node.extend({
	name : "property",
	type : 0,				//具体分类
	owner : null,			//宿主,unit类型
	init : function(data){},		//初始化函数，一般在创建template时调用，注意data对象可能是空的，必须做好判断
	clone : function(property){}	//数据克隆，一般在创建GameObject时调用
});

/**
 * 动作管理组件
 */
ActionsProperty = Property.extend({
	name : "actions",
	current : null,			//当前action引用
	endFlag : false,
	next : null,
	state : 0,				//动作状态，空中、倒地、晕倒等		1010 binary	0=普通站立（行走等地上状态）
	stacks : null			//map<name, stackInfo>结构
});


/**
 * 单位的攻击组件
 */
HitProperty = Property.extend({
	name : "hit",
	hit : null,			//当前action.hit的引用
	strength : 0,
	critical : 0,		//暴击
	speedFactor : 0,	//攻击速度
	effects : null,
	body : null,		//身体碰撞属性
	collide : null		//自身碰撞属性
});

/**
 * 单位的挨打组件
 */
HurtProperty = Property.extend({
	name : "hurt",
	hp : 0,
	defence : 0,		//防御值
	bodyType : 1,		//0无敌，1普通(一般人物)，2伪霸体(对远程攻击霸体)，3霸体(对全部攻击霸体)，4不倒地(精灵类，对所有攻击都只向后退)
	state : 0,			//无敌、中毒等状态组合，二进制
	body : null,		//身体碰撞属性
	collide : null		//自身碰撞属性
});

/**
 * 单位状态存储组件
 * 	stateIds 存储buff和其他状态的信息，key为effect.name，effect分别分布在hitCom,hurtCom和stateCom.timer中
 */
UnitStateComponent = Property.extend({
	stateIds : null,
	timer : null,
	
	ctor : function(){
		this.stateIds = {};
		this.timer = {};
	}
});

/**
*	单位从属关系组件
*	用于召唤兽和子弹之类
*/
MasterComponent = Property.extend({
	name : "master",
	top : null,			//顶级所属
	parent : null,		//上一级所属
	
	clone : function(){
		var com = new MasterComponent();
		com.top = this.top;
		com.parent = this.parent;
		return com;
	},
	
	newInstance : function(){
		var com = new MasterComponent();
		com.top = null;
		com.parent = null;
		return com;
	}
});

/**
 * 指令输入组件
 */
CommandProperty = Property.extend({
	name : "command",
	direction : 0,
	attack : 0,
	jump : 0,
	comboKey : 0
});

/**
 * 单位的碰撞组件
 */
CollideProperty = Property.extend({
	name : "collide",
	type : 0,
	num : 0,			//当前与之交叠的矩形个数（此帧）
	total : 0,			//累计交叠个数（所有帧）
	targets : null,		//中招的人记录在这里 -_-0，以id为key，value存什么都可以，用于检测是否重复计算碰撞
	rect : null,		//需要经过计算的实际矩形区域
	time : 0			//计时，每帧累加dt，用于计算碰撞间隔
});
