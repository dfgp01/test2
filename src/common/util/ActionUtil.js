/**
 * 	动作类的工具类
 */

ActionUtil = {
	
	/**
	 * 添加一个子系统到action中，根据优先级决定插入的位置，越高越靠前
	 */
	addSystem :function(action, system){
		if(action){
			for(var i in action.systemList){
				if(system.priority > action.systemList[i].priority){
					action.systemList.splice(i, 0, system);
					return;
				}
			}
			//上面的循环未return时，说明system的优先级是最小的，要补加到列表尾
			action.systemList.push(system);
		}
	},
	
	/**
	 * 	新旧系统替换，指定要去除的旧系统名字和新系统对象
	 *  如找不到旧系统，则将新系统添加到列表中
	 * @param oldName		旧系统名称
	 * @param newSystem		新系统实例
	 */
	replaceSystem : function(action, oldName, newSystem){
		for(var i in this.systemList){
			if(this.systemList[i].name == oldName){
				this.systemList[i] = newSystem;
				return;
			}
		}
		//上面的循环未return时，说明没发生替换，要补加新系统到列表
		this.addSystem(action, newSystem);
	},
	
	/**
	 * 根据名称获得系统对象
	 */
	findSystemByName : function(action, name){
		for(var i in action.systemList){
			if(action.systemList[i].name == name){
				return action.systemList[i];
			}
		}
		cc.log("findSystemByName error~! action-name:["+action.name+"] system-name:["+name+"] not found.");
		return null;
	},
	
	/**
	 * 根据lamda表达式构建动作链，最初版本，记住表达式内不允许有空格
	 *  > 连接符号，这是最基本的符号，用于前后两个动作连接
	 *  	例子：act1>act2	--效果：act1.nodes[act2.key] = act2;
	 * [] 子表达式，用于有重复的群组动作，用逗号分隔左右表达式，左边填连接表达式，右边填重复次数，暂时不支持嵌套表达式。
	 * 		例子：act1>[act2>act3,2]>act4	--效果：act2>act3这一段会重复2次，然后进入act4
	 * {} 子表达式，用于分支动作，里面只能填入多个act，用逗号分隔，暂不支持嵌套。
	 * 		例子：act1>{act2,act3,act4}>act5 --效果 act1下有三个分支act2,act3,act4，而这三个分支都有act5作为后继节点
	 */
	linkForExpress : function(node, strExpress, actions){
		//检查是否含有子表达式"[ ]"
		if(strExpress.charAt(0)=="["){
			var end = strExpress.indexOf("]");
			//分离子表达式和重复计数器，例如：[normalAtk1>normalAtk2,3]
			var prefix = strExpress.substring(1, end).split(",");
			var subExpress = "";
			var repeatCount = 0;
			subExpress = prefix[0];
			repeatCount = prefix[1];

			//子表达式内链处理
			var actNameArr = subExpress.split(">");
			var actList = [];
			for(var i in actNameArr){
				var act = actions[actNameArr[i]];
				if(!act){
					cc.log("action: " + actNameArr[i] + " not found! please check the express.");
					return;
				}
				actList.push(act);
			}
			//完成子表达式内连接
			for(var i=0; i<actList.length-1; i++){
				this.linkNode(actList[i], actList[i+1]);
			}
			
			//将子表达式内的头节点和上一尾节点连接起来
			this.linkNode(node, actList[0]);
			
			//重复计数器处理
			if(repeatCount > 0){
				//alert(repeatCount);
			}
			
			//截取子表达式外 ">" 后的表达式
			var suffix = strExpress.substring(end+2);
			//将尾节点作为下一次连接的头节点
			this.linkForExpress(actList[actList.length-1], suffix, actions);
		}
		//检查是否含有分支节点表达式"{ }"
		else if(strExpress.charAt(0)=="{"){
			var end = strExpress.indexOf("}");
			var actNameArr = strExpress.substring(1, end).split(",");
			for(var i in actNameArr){
				var act = actions[actNameArr[i]];
				if(!act){
					cc.log("action: " + actNameArr[i] + " not found! please check the lamda express.");
					return;
				}
				this.linkNode(node, act);
			}
			return;
		}
		//剩下的就是一个action名了
		else{
			var s = strExpress.indexOf(">");
			var act;
			if(s==-1){
				//到达结尾
				act = template.actionsCom.actions[strExpress];
				if(!act){
					cc.log("action: " + strExpress + " not found! please check the lamda express.");
					return;
				}
				this.linkNode(node, act);
				return;
			}
			var actName = strExpress.substring(0, s);
			act = template.actionsCom.actions[actName];
			if(!act){
				cc.log("action: " + actName + " not found! please check the lamda express.");
				return;
			}
			this.linkNode(node, act);
			var suffixStr = strExpress.substring(s+1);
			//继续递归
			this.linkForExpress(act, suffixStr, template);
		}
	}
};