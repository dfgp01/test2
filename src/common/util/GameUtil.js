/**
*	只是用来堆放很啰嗦的代码的地方
*	CreateBy Hugo-Fu 2015.12.05
*/
GameUtil = {
		
		//系统组件缓存
		systems : {
			sys : {
				main : null,
				player : null,
				motion : null,
				action : null,
				EvtMsg : null,
				animate : null
			},
			act : {
				stand : null,
				walk : null,
				motion : null
			}
		},
		
		//公共动作节点缓存
		actions : {
			hurt : null,
		},
		
		//效果逻辑缓存{id:class}
		effects : {
			
		},
		
		/**
		 * 生成碰撞标示码
		 * @param obj
		 * @param mask
		 */
		collideMask : function(group, mask){
			var mask  = 0;
			//类型判断：硬打击(包括敌人和block)，只攻击人(不包括block)，等等......
			if(mask & Constant.Collide.TARGET_ENEMY){
				//组号取反 与 全组掩码 可得其余组的二进制（主要是剔除block组）
				mask = mask | ((~group) & Service.Container.teamMask);
			}
			if(mask & Constant.Collide.TARGET_FRIEND){
				mask = mask | group;
			}
			if(mask & Constant.Collide.TARGET_BLOCK){
				//index为1的组通常是block组
				mask = mask | 1;
			}
			return mask;
		},
		
		/**
		 * 随机化系统的设想，涉及爆率、暴击值等功能
		 * 		例：57%的暴击是如何实现的呢？
		 * 		传统的想法：100个元素，57个1,43个0，打乱，然后随机取1,。但这样设计频繁创建问题。
		 * 		现解决方案：
		 * 		9x9 乘法表？
		 * 		[1,1,1,1,1,1,1,1,1,1]
		 * 		[1,1,1,1,1,1,1,1,1,0]
		 * 		[1,1,1,1,1,1,1,1,0,0]
		 * 		[1,1,1,1,1,1,1,0,0,0]		如此类推，一共10个组，最高组10个1，最低组10个0，
		 * 
		 * 		内参数：ranInt，随机生成100个，0~9，作为索引J，用完重新生成
		 * 		外参数：seek，如57，则 57 / 10 - 1 = 4，作为索引I，第I行拥有5个1和5个0，使用ranInt定位，几率五五开
		 * 		所以，百分比的个位数几乎是忽悠的，如果需要精确，可创造 100x100数组，占内存 40000byte
		 */
		random : function(seek){
			//待实现
		}
};
