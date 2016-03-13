/**
 * 主系统辅助类
 */
SystemUtil = {
	
	systems : {
		main : null,
		player : null,
		motion : null,
		action : null,
		EvtMsg : null,
		animate : null	
	},
	
	init : function(){
		//初始化主系统
		this.systems.main = new MainSystem();
		//this.systems.player = new PlayerSystem();
		this.systems.animate = new AnimateUpdateSystem();
		this.systems.motion = new MotionUpdateSystem();
		this.systems.action = new ActionUpdateSystem();
		//this.systems.EvtMsg = new EventMessageSystem();
		var mainSystem = this.systems.main;
		//mainSystem.addSystem(this.systems.player);
		mainSystem.addSystem(this.systems.motion);
		mainSystem.addSystem(this.systems.action);
		//mainSystem.addSystem(this.systems.EvtMsg);
		mainSystem.addSystem(this.systems.animate);
	}
};