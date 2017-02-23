/**
 * 攻击组件
 */
HitComponent = Component.extend({
	name : "hit",
	hitDatas : null,
	
	init : function(data){
		this.hitDatas = data.hitDatas;
	},
	
	start : function(hitProperty){
		hitProperty.index = 0;
		this.hitDatas[hitProperty.index].start(hitProperty);
	},
	
	update : function(dt, hitProperty){
		if(hitProperty.index >= this.hitDatas.length){
			return;
		}
		var _hitData = this.hitDatas[hitProperty.index];
		var _frameIndex = hitProperty.owner.view.frameIndex;
		if(_frameIndex >= _hitData.startFrame && _frameIndex <= _hitData.endFrame){
			_hitData.update(dt, hitProperty);
		}
		if(_frameIndex > _hitData.endFrame){
			hitProperty.index++;
			if(hitProperty.index < this.hitDatas.length){
				this.hitDatas[hitProperty.index].start(hitProperty);
			}
		}
	}
});

/**
 * 攻击判定数据
 */
HitDataComponent = Component.extend({
	name : "hitData",
	startFrame : 0,
	endFrame : 0,
	damage  : 0,
	collide : null,
	
	init : function(data){
		this.startFrame = data.startFrame;
		this.endFrame = data.endFrame;
		this.damage = data.damage;
		this.collide = new CollideComponent();
		this.collide.init({rect:data.rect, max:data.max});
	},
	
	start : function(hitProperty){
		//find all enemies
	},
	
	update : function(dt, hitProperty){
		
	}
});