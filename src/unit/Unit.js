/**
 * edit by Hugo-Fu
 * 2015.06.18
 */

GameObject = cc.Class.extend({
	id : null,
	name : null,
	group : 0
});

Unit = GameObject.extend({
	
	viewCom : null,
	hitCom : null,
	hurtCom : null,
	speedCom : null,
	motionCom : null,
	actionsCom : null,
	
	changeAction : function(name){
		this.currAction.end(this);
		this.actionsCom.actions[name].start(this);
		return;
	},
	
	//重置状态，在一个状态结束后调用
	resetAction : function(){
	},
	
	//击中时调用
	hit : function(){
		
	},
	
	//被击时调用
	hurt : function(unit, data){
		for(var i=0; i< this.hurtFunc.length; i++){
			this.hurtFunc[i].run(unit, data);
		}
		// run hurtstate
	}
});

UnitTemplate = cc.Class.extend({
	name : null,
	hitCom : null,
	hurtCom : null,
	speedCom : null,
	actionsCom : null,
	
	getNewInstance : function(){
		var unit = Service.popUnitFromPool();
		if(unit == null){
			unit = new Unit();
			unit.viewCom = new ViewComponent();
			//unit.viewCom.sprite = new cc.Sprite("#" + this.actionsCom.firstFrame);
			unit.viewCom.sprite = new cc.Sprite();
			unit.hitCom = new HitPropertiesComponent();
			unit.hurtCom = new HurtPropertiesComponent();
			unit.speedCom = new SpeedPropertiesComponent();
			unit.motionCom = new MotionComponent();
			unit.actionsCom = new ActionsComponent();
		}
		this.initCom(unit);
		return unit;
	},
	
	initCom : function(unit){
		
		unit.hitCom.strength = this.hitCom.strength;
		unit.hitCom.attSpeedFactor = this.hitCom.attSpeedFactor;
		
		unit.hurtCom.healthPoint = this.hurtCom.healthPoint;
		unit.hurtCom.maxHealthPoint = this.hurtCom.maxHealthPoint;
		unit.hurtCom.defence = this.hurtCom.defence;
		unit.hurtCom.bodyType = this.hurtCom.bodyType;
		unit.hurtCom.bodyState = this.hurtCom.bodyState;
		unit.hurtCom.isDead = this.hurtCom.isDead;
		
		unit.speedCom.speed = this.speedCom.speed;
		unit.speedCom.currSpeed = this.speedCom.currSpeed;
		unit.speedCom.maxSpeed = this.speedCom.maxSpeed;
		
		unit.motionCom.vx = 0;
		unit.motionCom.vy = 0;
		unit.motionCom.dx = 0;
		unit.motionCom.dy = 0;
		
		unit.actionsCom.actions = this.actionsCom.actions;
		unit.actionsCom.frameIndex = 0;
		unit.actionsCom.state = this.actionsCom.state;
		
		unit.viewCom.sprite.setSpriteFrame("#"+unit.actionsCom.actions.stand.frames[0]);
	}
});