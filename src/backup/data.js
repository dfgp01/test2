/**
* A skill-action released
* 1. input command find the tree
* 2. init skill properties: speed hit etc... set-main-loop
* 3. a tick play a frame
* 4. vec2 progress, etc progress...
* 
* can use obj-id to decide if singleton or not. eg:two unit use the same action,same vec...
**/

/**
 * a json:
 * {
 * 	id: "act_grp_1",
 * 	actions: ['#act_id1','#act_id2'],
 * }
 * 
 * {
 * 	id: "act_id1",
 * 	vec: {x:3,y:0},
* 	frames: ['#f1','#f2','#f3'],
* 	type:	1,		//is an attack_act
* 	rect: {x:0,y:0,width:20,height:20},
* }
* 
* {
* 	id: "fct1",
* 	frames:[],
* 	isRepeat:false
* }
* 
* use dataEntity-function to depoly system
* 
* singleton function: skfunc1
* dt:{
* 	
* }
*/
var game = game || {};
game.property = {};
game.property.act = {};
game.property.act.NORMAL_ATT = {
		id : "att",
		name : "测试普通攻击链",
		nodes : [
		      {
		    	id : "att1",
		    	name : "第一击",
		    	frames : ['deep_sk_0','deep_sk_1','deep_sk_2','deep_sk_3']
		      },
		      {
		    	id : "att2",
		    	name : "第二击",
		    	frames : ['deep_att_1.png','deep_att_2.png']
		      },
		      {
		    	id : "att3",
		    	name : "第三击",
		    	frames : ['deep_run_0.png','deep_run_1.png','deep_run_2.png']
		      }
		],
		repeat : [
		          {
		        	  start : 0,
		        	  end : 1,
		        	  count : 2
		          },
		          {
		        	  start : 2,
		        	  end : 2,
		        	  count : 3
		          }
		       ]
};