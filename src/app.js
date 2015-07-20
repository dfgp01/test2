
var HelloWorldLayer = cc.Layer.extend({

	winSize : 0,
	playerSys : null,
	
	initUI : function(){
		//close button
		 var closeItem = new cc.MenuItemImage(
	        		res.CloseNormal_png,
	        		res.CloseSelected_png,
	        		function () {
	        			cc.log("closeItem is clicked!");
	        			cc.director.popScene();
	        		}, this);
	        closeItem.attr({
	        	x: this.winSize.width - 20,
	        	y: 20,
	        	anchorX: 0.5,
	        	anchorY: 0.5
	        });

	        var menu = new cc.Menu(closeItem);
	        menu.x = 0;
	        menu.y = 0;
	        this.addChild(menu, 9);
	        
	        //arrows
	        Arrows.init(100, 100, this.playerSys);
	        this.addChild(Arrows.sprite, 5);
	},
	
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        this.winSize = cc.winSize;

        // add background
        var bg = new cc.Sprite(res.background_png);
        bg.attr({
        	x: this.winSize.width / 2,
        	y: this.winSize.height / 2
        });
        this.addChild(bg, 0);
        
      
        
        Service.initUnitTemplate(character_data);
    	var unit = Service.createUnit(character_data.name, 0);
    	var sprite = unit.viewCom.sprite;
    	sprite.attr({
    		x: 150,
        	y: 250
    	});
    	sprite._scaleX = -1;
    	this.addChild(sprite, 2);
        
        var mas = new MainActionSystem();
        var anims = new MainAnimateSystem();
        this.playerSys = new PlayerSystem();
        this.playerSys.target = unit;
        SystemManager.addSystem(mas);
        SystemManager.addSystem(anims);
        SystemManager.addSystem(this.playerSys);
        SystemManager.start();
        
        this.initUI();

        var attRect = cc.rect(0, 0, sprite.width, sprite.height);							//单位内
        var selfPointer = this;
        var listener = cc.EventListener.create({
        	event: cc.EventListener.TOUCH_ONE_BY_ONE,
        	//event: cc.EventListener.TOUCH_ALL_AT_ONCE,
        	swallowTouches: true,
        	onTouchBegan: function (touch, event) {
        		var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
        		
        		//这个报废，但暂时不删
        		/*if (cc.rectContainsPoint(rect, locationInNode)) {
        			cc.log("点中精灵：" + locationInNode.x + "," + locationInNode.y);
        			
        			//标注1：这一句在JSB中报错：Invail Native Object，在chrome中没问题
        			//		网上说action要retain()，估计与内存管理有关
        			deep.runAction(cc.animate(animation).repeatForever());	
        			cc.log(touch.getID());
        		}*/
        		
        		var point = touch.getLocation();
        		//临时操作
        		if(cc.rectContainsPoint(attRect, locationInNode)){
        			pla.pressKey(Constant.CMD.ATTACK_ONCE);
        		}
        		else if(cc.rectContainsPoint(leftBottomRect, point)){
        			pla.pressDirection(Constant.CMD.LEFT);
        		}
        		else if(cc.rectContainsPoint(rightBottomRect, point)){
        			pla.pressDirection(Constant.CMD.RIGHT);
        		}
        		else if(cc.rectContainsPoint(leftTopRect, point)){
        			pla.pressDirection(Constant.CMD.UP);
        		}
        		else if(cc.rectContainsPoint(rightTopRect, point)){
        			pla.pressDirection(Constant.CMD.DOWN);
        		}else{
        			cc.log("click what? " + point.x + "," + point.y);
        		}
        		
        		//返回值是true，往下传递，触发onTouchMoved和onTouchEnded，false则不传递
        		//cc.log("id:"+touch.getID() + ", pos:[" + touch.getLocation().x + "," + touch.getLocation().y + "]");
        		return true;
        	},
        	onTouchMoved: function (touch, event) {
        		//cc.log("移动:" + touch.getLocation().x + "," + touch.getLocation().y );
        	},
        	onTouchEnded: function (touch, event) {
        		//cc.log("释放:" + touch.getLocation().x + "," + touch.getLocation().y );
        		var point = touch.getLocation();
        		var locationInNode = sprite.convertToNodeSpace(touch.getLocation());
        		//临时操作
        		if(cc.rectContainsPoint(attRect, locationInNode)){
        			pla.releaseKey(Constant.CMD.ATTACK);
        		}
        		if(cc.rectContainsPoint(leftBottomRect, point)){
        			pla.releaseKey(Constant.CMD.LEFT);
        		}
        		else if(cc.rectContainsPoint(rightBottomRect, point)){
        			pla.releaseKey(Constant.CMD.RIGHT);
        		}
        		else if(cc.rectContainsPoint(leftTopRect, point)){
        			pla.releaseKey(Constant.CMD.UP);
        		}
        		else if(cc.rectContainsPoint(rightTopRect, point)){
        			pla.releaseKey(Constant.CMD.DOWN);
        		}else{
        			cc.log("click what? " + point.x + "," + point.y);
        		}
        	}
        });
        //cc.eventManager.addListener(listener, this);
        
        if ('touches' in cc.sys.capabilities) {
        	cc.log("touchs");
        }else{
        	//cc.log("not touchs");
        }
        
        //标注2：这一句在JSB和chrome下都没问题
        //deep.runAction(cc.animate(animation).repeatForever());
        
        //this.schedule(this.updateCustom, 0.45, cc.REPEAT_FOREVER, 5);
        this.scheduleUpdate();
        return true;
    },
    
    update : function(dt){
    	SystemManager.update(dt);
    },
    
    updateCustom : function(dt){
    	SystemManager.update(dt);
    }
});

/**
 * 本来想放在main.js中的，但不行，因为不认识cc.Scene.extend，估计是加载顺序问题
 */
var HelloWorldScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new HelloWorldLayer();
		this.addChild(layer);
		layer = new ControllerLayer();
		this.addChild(layer);
	}
});