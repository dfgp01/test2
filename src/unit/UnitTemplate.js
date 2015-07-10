/**
 *  单位模板，相当于单位的制造工厂，以便于对象根据初始数值重新初始化
 */
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
		//unit.viewCom.sprite.setSpriteFrame(this.actionsCom.actions.stand.animateCom.frames[0]);
		unit.resetActionState();
	}
});