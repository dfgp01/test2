/**
 *  Object pool
 */
var pool = {
	step : 5,
	count : 2,
	
	getObject : function(clz, callback){
		
		//防止因输入错误而无穷递归
		var pool = this.getPoolByClass(clz);
		if(pool == null){
			return null;
		}
		
		var index = 0;
		index = callback.call(this, pool);
		if(index == -1){
			return this.addToPool(clz, null, pool)[0];
		}else{
			return pool[index];
		}
	},
	
	getPoolByClass : function(clz){
		if(clz == Bullet){
			return this.objPools.bullet;
		}
		if(clz == Enemy){
			return this.objPools.enemy;
		}
		return null;
	},
	
	addToPool : function(clz, arr, pool){
		if(clz == undefined || clz == null){
			return null;
		}
		if(arr == undefined || arr == null){
			arr = [];
			for(var i=0; i<this.step; i++){
				arr.push(new clz());
			}
		}
		if(pool == undefined || pool == null){
			var _pool = this.getPoolByClass(clz);
		}
		for(var i in arr){
			_pool.push(arr[i]);
		}
		return arr;
	},
	
	objPools : {
		bullet : [],
		enemy : []
	}
};

function callback_bullet(arr){
	var index = -1;
	for( i in arr){
		if(!arr[i].alive){
			index = i;
			break;
		}
	}
	return index;
}
function callback_enemy(arr){
	var index = -1;
	for( i in arr){
		if(arr[i].dead){
			index = i;
			break;
		}
	}
	return index;
}

function Enemy(name){
	this.name = name;
	this.dead = false;
}
function Bullet(){
	this.alive = true;
}
Bullet.prototype.fly = function(){
	alert("fly");
}

window.onload = function(){

	pool.addToPool(Enemy);
	var s = 'enemy';
	alert(pool.objPools[s].length);
	//alert(pool.objPools.enemy.length);		可以
	//alert(pool.objPools[enemy].length);		不行
	//alert(pool.objPools['enemy'].length);	可以
	// pool['n'] = 3; 可以这样定义新属性，后面可以使用 pool.n 访问 
	pool.objPools.enemy[4].dead = true;
	var en = pool.getObject(Enemy, callback_enemy);
	alert(en.dead);
};