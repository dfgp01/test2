/**
 *  单位模板，相当于单位的制造工厂，以便于对象根据初始数值重新初始化
 *  因为每个模板对应一种单位，每种单位特征各不相同，所以也应该包含对象池
 *  edit by Hugo-Fu 2015.10.05
 */
UnitTemplate = cc.Class.extend({
	
	name : null,
	featureCode : 0,
	availableList : null,		//对象池
	comList : null,			//此单位具有的组件

	actionsCom : null,		//动作逻辑组件是必须有的

	init : function(data){
		this.name = data.name;
		this.featureCode = data.featureCode;
		this.availableList = [];
		
		this.actionsCom = new ActionsComponent();
		this.actionsCom.actions = {};

		//动画组件，暂时作废
		/*if(this.featureCode & Constant.GameObjectType.animate){
			var animateCom = new AnimateComponent();
		}*/
		
		//运动组件
		if(this.featureCode & Constant.GameObjectType.motion){
			var motionCom = new MotionComponent();
			if(Util.checkIsInt(data, "speedFactor", false)){
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
		/*if(Util.checkIsNumber(data, "walkSpeed", true)){
			this.speedCom.dx = data.walkSpeed * GameSetting.unitSpeedFactor.walkX;
			this.speedCom.dy = data.walkSpeed * GameSetting.unitSpeedFactor.walkY;
		}*/
	},
	
	getNewInstance : function(){
		var unit = this.availableList.pop();
		if(unit == null){
			unit = new GameObject();
			unit.name = this.name;
			unit.viewCom = new ViewComponent();
			unit.viewCom.sprite = new cc.Sprite();
			unit.actionsCom = new ActionsComponent();
			for(var i in this.comList){
				var name = this.comList[i].name;
				unit.coms[name] = this.comList[i].clone();
			}
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