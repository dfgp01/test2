
var HelloWorldLayer = cc.Layer.extend({

	playerSys : null,
	
	initUI : function(){
		//close button
		 var closeItem = new cc.MenuItemImage(
	        		res.CloseNormal_png,
	        		res.CloseSelected_png,
	        		function () {
	        			cc.log("closeItem is clicked!");
	        		}, this);
	        closeItem.attr({
	        	x: size.width - 20,
	        	y: 20,
	        	anchorX: 0.5,
	        	anchorY: 0.5
	        });

	        var menu = new cc.Menu(closeItem);
	        menu.x = 0;
	        menu.y = 0;
	        this.addChild(menu, 1);
	        
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
        var size = cc.winSize;

        // add background
        var bg = new cc.Sprite(res.background_png);
        bg.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(bg, 0);
        
      //load frames
    	cc.spriteFrameCache.addSpriteFrames(res.deep_0_plist);
        cc.spriteFrameCache.addSpriteFrames(res.deep_1_plist);
        cc.spriteFrameCache.addSpriteFrames(res.deep_2_plist);
        
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
        
        //别忘了这里是gl坐标系
        var width = size.width * 0.5;
        var height = size.height * 0.5;
        var leftTopRect = cc.rect(0, height, width, height);					//左上
        var leftBottomRect = cc.rect(0, 0, width, height);					//左下
        var rightTopRect = cc.rect(width, height, width, height);		//右上
        var rightBottomRect = cc.rect(width, 0, width, height);			//右下
        var s = sprite.getContentSize();
        var attRect = cc.rect(0, 0, s.width, s.height);							//单位内
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
        
        this.schedule(this.updateCustom, 0.45, cc.REPEAT_FOREVER, 5);
        //this.scheduleUpdate();
        return true;
    },
    
    update : function(dt){
    	SystemManager.update(dt);
    },
    
    updateCustom : function(dt){
    	SystemManager.update(dt);
    }
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

var iterObj = function(attr){
	var str = "";
	for(var i in attr){
		if(typeof(attr[i]) != 'function'){
			str += i + ":" + attr[i] + "\n\r";
		}else{
			str += i + ":" + attr[i] + "\n";
		}
	}
	return str;
}
