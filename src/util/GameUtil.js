/**
*	只是用来堆放很啰嗦的代码的地方
*	CreateBy Hugo-Fu 2015.12.05
*	UpdateBy Hugo-Fu 2017.03.30
*/
GameUtil = {
		
		max : function(num1, num2){
			return num1 > num2 ? num1 : num2;
		},
		
		min : function(num1, num2){
			return num1 < num2 ? num1 : num2;
		},
		
		distance : function(num1, num2){
			return num1 > num2 ? num1 - num2 : num2 - num1;
		},
		
		calcCollideRect : function(rect1, rect2){
			var rect1 = this.actualRect(collidePro1.rect, collidePro1.owner.view);
			var rect2 = this.actualRect(collidePro2.rect, collidePro2.owner.view);
			var x1 = this.max(rect1.x, rect2.x);
			var x2 = this.min(rect1.x + rect1.width, rect2.x + rect2.width);
			var z1 = this.max(rect1.x, rect2.x);
			var z2 = this.min(rect1.z + rect1.height, rect2.z + rect2.height);
			if(x2 > x1 && z2 > z1){
				var rect = new Rect();
				rect.x = x1;
				rect.xMax = x2;
				rect.z = z1;
				rect.zMax = z2;
				rect.width = x2 - x1;
				rect.height = z2 - z1;
				return rect;
			}
			return null;
		},
		
		/**
		 * 凡是涉及移动、更新位置的统一调用这方法。
		 * @param unit
		 * @param dx
		 * @param dy
		 * @returns
		 */
		move : function(unit, dx, dz, vx){
			unit.view.x += dx;
			unit.view.y += dy;
			unit.view.z += dz;
			unit.view.dx += dx;
			unit.view.dy += dy+dz;
			this.moveRect(unit.body.rect, dx, dy+dz);
		},
		
		moveRect : function(rect, dx, dy){
			rect.x += dx;
			rect.y += dy;
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
