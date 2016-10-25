/**
 * 全局游戏设置
 */
GameSetting = {
		
		logicTick : Constant.TICK_FPS30,
		renderTick : Constant.TICK_FPS24,

		framerate : 60,				//cocos2d默认fps是60

		gravity : -2,				//一般重力，一些组件可设置自定义重力
		maxGravity : -10,			//最大引力

		hitBack : 15,					//硬直后退距离
		hitDownX : 135,			//倒地后退距离X
		hitDownY : 30,				//倒地后退距离Y
		stiffTime : 500,					//硬直时间(毫秒)
		knockDownTime : 800,	//倒地硬直时间(毫秒)

		attackDx : 5,		//普通攻击默认推进距离

		//单位移动时，Y轴与X轴的相对速度比
		unitSpeedFactor : {
			walkX : 1,
			walkY : 0.618,
			//runX : 2,
			//runY : 1.6,
			airX : 0.9,
			airY : 0.8
		}
};