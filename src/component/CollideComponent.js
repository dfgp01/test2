/**
 * 碰撞交互组件，如会阻碍通行、可拾取、可接触等
 */
CollideComponent = Component.extend({
	name : "collide",
	type : 0,		//碰撞类型
	mask : 0,		//目标类型
	rect : null,	//原型矩形框
	maxNum : 1,		//最大碰撞数量
	inteval : 0.1,	//同个目标碰撞检测间隔
	
	init : function(data){
		this.rect = data.rect;
		this.maxNum = data.maxNum;
	},
	
	start : function(collideProperty){
		collideProperty.num = 0;
		collideProperty.total = 0;
		collideProperty.time = 0;
		ObjectManager.nodes.addCollideNode(collideProperty);
	},

	update : function(dt, collidePro){
		collideProperty.time += dt;
		this.check(dt, collidePro);
	},
	
	check : function(dt, collidePro){
		if(collidePro.total >= this.maxNum){
			return;
		}
		var cts = ObjectManager.nodes.collideTypes;
		for(var i in cts){
			if((cts[i].type & this.mask) && cts[i].head != null){
				var _target = cts[i].head;
				var _rect = null;
				do{
					if(this.selfCheck(collidePro, _target) && 
						this.rangeCheck(collidePro, _target) && 
							(_rect=GameUtil.calcCollideRect(collidePro, _target))!=null){
						var collideHis = collidePro1.his[collidePro2.id];
						if(!collideHis){
							collideHis = ObjectManager.getCollideHis();
							collidePro1.his[collidePro2.id] = collideHis;
						}
						if(collidePro1.time - collideHis.time > this.inteval){
							collideHis.time = collidePro1.time;
							collidePro.num++;
							
						}
						/*EventDispatcher.send(Constant.EVT_UNIT_COLLIDE, collidePro1, {
							rect : _rect,
							target : _target,
							mask : this.type | _target.type
						});*/
					}
					_target = _collide.next;
				}while(_target != null);
			}
		}
	},
	
	selfCheck : function(collidePro1, collidePro2){
		return collidePro.owner != collidePro2.owner;
	},
	
	rangeCheck : function(collidePro1, collidePro2){
		return GameUtil.distance(collidePro1.owner.view.y, collidePro2.owner.view.y) < collidePro1.range + collidePro2.range;
	},
	
	intevalCheck : function(collidePro1, collidePro2){
		var collideHis = collidePro1.his[collidePro2.id];
		return collideHis && collidePro1.now - collideHis.time < this.inteval ? false : true;
	}
});