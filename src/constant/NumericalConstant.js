/**
 * 用于定义数值常量
 */
NumericalConstant = {
	/**
	 * 常用数值范围
	 */
	MIN_POSITIVE_INTEGER : 1,		//最小正整数
	MAX_POSITIVE_INTEGER : 9999999,	//最大正整数，针对游戏设置，比如最大分数、最大金额等不能超过此值
	MIN_NATURAL_NUMBER : 0,			//最小自然数
	MIN_FLOAT_NUMBER : 0.01,		//最小浮点数
	MIN_FPS_TICK : 0.016,			//最小帧频，比这个数更小的就没有意义了
	MAX_OBJECT_AMOUNT : 99,			//最大物体数量
	NONE : 0,		//默认无
	FOREVER : -1,	//无限循环
	
	/**
	 * 用于表示文本数据的布尔逻辑
	 */
	BOOLEAN_TRUE : 1,
	BOOLEAN_FALSE : 0,
	
	/**
	 * 帧时间（秒）
	 */
	/*TICK_FPS60 : 0.0166,
	TICK_FPS48 : 0.02,
	TICK_FPS36 : 0.027,
	TICK_FPS30 : 0.0333,
	TICK_FPS25 : 0.04,
	TICK_FPS24 : 0.041,
	TICK_FPS20 : 0.05,
	TICK_FPS12 : 0.083,
	TICK_FPS10 : 0.1,
	TICK_FPS05 : 0.2,*/
	
	/**
	 * 帧时间（毫秒）
	 */
	TICK_FPS60 : 16.6,
	TICK_FPS48 : 20,
	TICK_FPS36 : 27,
	TICK_FPS30 : 33.3,
	TICK_FPS25 : 40,
	TICK_FPS24 : 41,
	TICK_FPS20 : 50,
	TICK_FPS12 : 83,
	TICK_FPS10 : 100,
	TICK_FPS05 : 200
};
