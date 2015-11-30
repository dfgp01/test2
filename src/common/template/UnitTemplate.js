/**
 *  单位模板，相当于单位的制造工厂，以便于对象根据初始数值重新初始化
 *  因为每个模板对应一种单位，每种单位特征各不相同，所以也应该包含对象池
 *  edit by Hugo-Fu 2015.10.05
 *  update by Hugo-Fu 2015.11.26	加入ID递增，放入Service缓存
 */
UnitTemplate = cc.Class.extend({
	
	name : null,
	type : 0,
	featureCode : 0,
	availableList : null,		//对象池
	//comList : null,			//此单位具有的组件，*尝试使用遍历对象的方式

	actionsCom : null,		//动作逻辑组件是必须有的
	
	nextId : 1,

	init : function(data){
		this.name = data.name;
		this.type = data.type;
		this.featureCode = data.featureCode;
		this.availableList = [];
		this.comList = [];
		
		this.actionsCom = new ActionsComponent();
		this.actionsCom.actions = {};
		this.actionsCom.baseAct = {};

		//动画组件，暂时作废
		/*if(this.featureCode & Constant.GameObjectType.animate){
			var animateCom = new AnimateComponent();
		}*/
		
		//运动组件
		if(this.featureCode & Constant.GameObjectFeature.MOTION){
			var motionCom = new MotionComponent();
			if(ObjectUtil.checkIsInt(data, "speedFactor", false)){
				motionCom.speedFactor = data.speedFactor;
			}else{
				motionCom.speedFactor = 1;
			}
			this.comList.push(motionCom);
		}
		
		/*this.hitCom = new HitPropertiesComponent();
		this.hurtCom = new HurtPropertiesComponent();
		this.speedCom = new SpeedPropertiesComponent();*/
		
		//数据上配置的速度指的是x轴的速度，y轴速度一般比x轴要小一些百分比
		//这些通用设置可以在GameSetting类中找到
		/*if(ObjectUtil.checkIsNumber(data, "walkSpeed", true)){
			this.speedCom.dx = data.walkSpeed * GameSetting.unitSpeedFactor.walkX;
			this.speedCom.dy = data.walkSpeed * GameSetting.unitSpeedFactor.walkY;
		}*/
	},
	
	/**
	 * 从模板中获取一个新对象
	 * @returns unit
	 */
	getNewInstance : function(){
		var unit = this.availableList.pop();
		if(unit == null){
			unit = new GameObject();
			unit.name = this.name;
			
			//注意，单位的ID是 名字+id序号 的组合
			unit.id = this.name + this.nextId;
			this.nextId++;
			
			unit.viewCom = new ViewComponent().clone();
			unit.coms = {};
			for(var i in this.comList){
				var name = this.comList[i].name;
				unit.coms[name] = this.comList[i].clone();
			}
			unit.actionsCom = this.actionsCom.clone();
			
			//放到对象池里，不用频繁创建
			this.availableList.push(unit);
		}else{
			//重置所有组件内的数值
			for(var i in unit.coms){
				unit.coms[i].reset();
			}
			unit.actionsCom.reset();
		}
		return unit;
	}
});