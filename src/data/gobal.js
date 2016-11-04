/**
 * 全局游戏设置
 */
GameSetting = {
		
		logicTick : Constant.TICK_FPS30,
		renderTick : Constant.TICK_FPS24,

		framerate : 60,				//cocos2d默认fps是60

		attackDx : 5,		//普通攻击默认推进距离

};

/**
 * 一些默认参数值
 */
GameSetting.Default = {
	gravity : -2,			//一般重力，一些组件可设置自定义重力
	maxGravity : -10,		//最大引力
	
	hitBackX : 15,			//一般硬直攻击后退距离
	hitDownX : 135,			//倒地攻击后退距离X
	hitDownY : 30,			//倒地攻击后退距离Y
	
	stiffTime : 500,		//普通攻击硬直时间(毫秒)
	knockDownTime : 800,	//倒地攻击躺地时间(毫秒)
	
	moveYFactor : 0.618,	//Y轴移动比例
	
	animateFrameTick : 0.041,	//默认动画帧间隔，24fps
}