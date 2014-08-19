BPMN={
	defaultLogo:"../../logo/ophion.png",
	diagrams: new Array(),
	errors:{
		configNullContainer:"Please provide config.container property",
		configNullSkeleton:"Please provide config.skeleton property",
		skeletonNullProcess:"Please provide skeleton.process property",
		skeletonNullWidth:"Please provide skeleton.width property",
		skeletonNullHeight:"Please provide skeleton.height property",
		containerNotExists:"There is no an element with id: {0} in this page.",
		elemIdNotValid:"Please provide the id of element. Array index: {0}",
		elemTypeNotValid:"Please provide a valid type for element with id {0}",
		styleNotValid:"Please provide a valid style for skeleton. Read docs/skeleton.txt"
	},
	elemTypes:[
		{id:0,name:"Event start"},
		{id:1,name:"Event normal end"},
		{id:2,name:"Event terminate end"},
		{id:3,name:"Human task"},
		{id:4,name:"Service task"},
		{id:5,name:"Gateway normal"},
		{id:6,name:"Gateway parallel"},
		{id:7,name:"Gateway complex"}
	],
	exists:function(container){
		for(var i=0;i<this.diagrams.length;i++){
			if(this.diagrams[i].container==container){
				return i;
			}
		}
		return -1;
	},
	draw:function(config){
		//defining global drawing values
		var radius=18;
		//validating required elements inside config object
		if(config.container==null || config.container=="") throw new Error(this.errors["configNullContainer"]);
		if(config.skeleton==null)throw new Error(this.errors["configNullSkeleton"]);
		
		//validating required elements inside config.skeleton object
		//Must be in the pool - if(config.skeleton.process==null || config.skeleton.process=="") throw new Error(this.errors["skeletonNullProcess"]);
		if(config.skeleton.width==null) throw new Error(this.errors["skeletonNullWidth"]);
		if(config.skeleton.height==null) throw new Error(this.errors["skeletonNullHeight"]);
		
		//defining default variables
		if(config.textMargin==null || isNaN(config.textMargin))config.textMargin=7;
		if(config.showLogo==null)config.showLogo=false;
		if(config.showLogo==true && config.logo==null){
			config.logo={
				url:this.defaultLogo,
				width:185,
				height:75
			}
		}
		//defining default styles
		var style=config.skeleton.style;
		if(style==null)style={};
		if(style.containerBackground==null || style.containerBackground=="")style.containerBackground="#c8d9ff";
		if(style.pool==null)style.pool={};
		if(style.pool.fontFamily==null || style.pool.fontFamily=="")style.pool.fontFamily="Calibri";
		if(style.pool.fontSize==null || isNaN(style.pool.fontSize))style.pool.fontSize=30;
		if(style.pool.fontColor==null || style.pool.fontColor=="")style.pool.fontColor="black";
		if(style.activity==null)style.activity={};
		if(style.activity.background==null || style.activity.background=="")style.activity.background="#5b6bcb";
		if(style.activity.borderWidth==null || isNaN(style.activity.borderWidth))style.activity.borderWidth=2;
		if(style.activity.borderRadious==null || isNaN(style.activity.borderRadious))style.activity.borderRadious=5;
		if(style.activity.fontFamily==null || style.activity.fontFamily=="")style.activity.fontFamily="Calibri";
		if(style.activity.fontSize==null || isNaN(style.activity.fontSize))style.activity.fontSize=16;
		if(style.activity.fontColor==null || style.activity.fontColor=="")style.activity.fontColor="black";
		if(style.activity.colorStatus==null)style.activity.colorStatus={};
		if(style.activity.colorStatus.closed==null || style.activity.colorStatus.closed=="")style.activity.colorStatus.closed="blue";
		if(style.activity.colorStatus.notOpen==null || style.activity.colorStatus.notOpen=="")style.activity.colorStatus.notOpen="black";
		if(style.activity.colorStatus.open==null || style.activity.colorStatus.open=="")style.activity.colorStatus.open="green";
		if(style.activity.colorStatus.delayed==null || style.activity.colorStatus.delayed=="")style.activity.colorStatus.delayed="red";
		if(style.activity.colorStatus.expireSoon==null || style.activity.colorStatus.expireSoon=="")style.activity.colorStatus.expireSoon="yellow";
		if(style.otherElems==null)style.otherElems={};
		if(style.otherElems.fontFamily==null || style.otherElems.fontFamily=="")style.otherElems.fontFamily="Calibri";
		if(style.otherElems.fontSize==null || isNaN(style.otherElems.fontSize))style.otherElems.fontSize=16;
		if(style.otherElems.fontColor==null || style.otherElems.fontColor=="")style.otherElems.fontColor="black";
		if(style.otherElems.colors==null)style.otherElems.colors={};
		if(style.otherElems.colors.start==null || style.otherElems.colors.start=="")style.otherElems.colors.start="#169109";
		if(style.otherElems.colors.normalEnd==null || style.otherElems.colors.normalEnd=="")style.otherElems.colors.normalEnd="#a76363";
		if(style.otherElems.colors.terminalEnd==null || style.otherElems.colors.terminalEnd=="")style.otherElems.colors.terminalEnd="#910909";
		if(style.otherElems.colors.gateway==null || style.otherElems.colors.gateway=="")style.otherElems.colors.gateway="#cfa569";
		if(style.otherElems.colors.gatewayLine==null || style.otherElems.colors.gatewayLine=="")style.otherElems.colors.gatewayLine="#9f7437";
		if(style.wire==null)style.wire={};
		if(style.wire.regular==null)style.wire.regular={};
		if(style.wire.regular.lineColor==null || style.wire.regular.lineColor=="")style.wire.regular.lineColor="black";
		if(style.wire.regular.lineWidth==null || isNaN(style.wire.regular.lineWidth))style.wire.regular.lineWidth=3;
		if(style.wire.closed==null)style.wire.closed={};
		if(style.wire.closed.lineColor==null || style.wire.closed.lineColor=="")style.wire.closed.lineColor="blue";
		if(style.wire.closed.lineWidth==null || isNaN(style.wire.closed.lineWidth))style.wire.closed.lineWidth=4;
		if(style.drag==null)style.drag={};
		if(style.drag.lineColor==null || style.drag.lineColor=="")style.drag.lineColor="#115682";
		if(style.drag.lineWidth==null || isNaN(style.drag.lineWidth))style.drag.lineWidth=5;
		
		//starting to draw the diagram
		var elemContainer=document.getElementById(config.container);
		if(elemContainer!=null){
			this.clear(config.container);
			this.diagrams[this.diagrams.length]=config;
			
			//setting background of container
			elemContainer.style.backgroundColor=style.containerBackground;
			elemContainer.style.display="block";
			elemContainer.style.position="absolute";
			elemContainer.style.overflow="auto";
			
			//setting the size of container
			if(config.width!=null && !isNaN(config.width)){
				elemContainer.style.width=config.width;
			}
			else{
				elemContainer.style.width= config.skeleton.width;
			}
			if(config.height!=null && !isNaN(config.height)){
				elemContainer.style.height=config.height;
			}
			else{
				elemContainer.style.height=config.skeleton.height;
			}
			
			//setting the stage
			var stage = new Kinetic.Stage({
				container: config.container,
				width: config.skeleton.width,
				height: config.skeleton.height
			});
			
			//creating layers
			var poolsLayer=new Kinetic.Layer();
			var lanesLayer=new Kinetic.Layer();
			var phasesLayer=new Kinetic.Layer();
			var elemsLayer=new Kinetic.Layer();
			var wiresLayer=new Kinetic.Layer();
			var breakPointsLayer= new Kinetic.Layer();
			var logoLayer=new Kinetic.Layer();
			var processLayer=new Kinetic.Layer();
			
			//creating pools ,pashes and lanes
			var pools=config.skeleton.pools;
			for(var i=0;i<pools.length;i++){
				var pool = new Kinetic.Rect({
					x:pools[i].x,
					y:pools[i].y,
				  width: pools[i].width,
				  height: pools[i].height,
				  stroke: style.pool.fontColor,
				  strokeWidth: 3
				});
				
				/*
				*	The folowing lines define the pool 
				*	name and its position
				*/
				var poolName=new Kinetic.Text({
				  text: pools[i].name,
				  fontSize: style.pool.fontSize,
				  fontFamily: style.pool.fontFamily
				});
				poolName=new Kinetic.Text({
				  x: pools[i].x+config.textMargin,
				  y:pools[i].y+(pools[i].height+poolName.getWidth())/2,
				  text: pools[i].name,
				  fontSize: style.pool.fontSize,
				  fontFamily: style.pool.fontFamily,
				  fill: style.pool.fontColor,
				  rotation:-90//Math.PI*-1/2
				});
				
				var poolNameRect = new Kinetic.Rect({
					x:pools[i].x,
					y:pools[i].y,
				  width: 2*config.textMargin+poolName.getHeight(),
				  height: pools[i].height,
				  stroke: style.pool.fontColor,
				  strokeWidth: 3
				});
				
				var startXPos=poolNameRect.getWidth()+pools[i].x;
				var startYPos=pools[i].y;
				var lanes=pools[i].lanes;
				var laneNameRectWidth=0;
				for(var j=0;j<lanes.length;j++){
				
					var laneHeight=lanes[j].percentHeight*pools[i].height/100;
				
					var lane= new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: pools[i].width-poolNameRect.getWidth(),
						height: laneHeight,
						stroke: style.pool.fontColor,
						strokeWidth: 3
					});
					
					
					
					/*
					*	The folowing lines define the lane 
					*	name and its position
					*/
					var laneName=new Kinetic.Text({
						text: lanes[j].role,
						fontSize: style.pool.fontSize,
						fontFamily: style.pool.fontFamily
					});
					laneName=new Kinetic.Text({
						x: startXPos+config.textMargin,
						y:startYPos+(laneHeight+laneName.getWidth())/2,
						text: lanes[j].role,
						fontSize: style.pool.fontSize,
						fontFamily: style.pool.fontFamily,
						fill: style.pool.fontColor,
						rotation:-90//Math.PI*-1/2
					});
					
					var laneNameRect = new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: 2*config.textMargin+laneName.getHeight(),
						height: laneHeight,
						stroke: style.pool.fontColor,
						strokeWidth: 3
					});
					
					laneNameRectWidth=laneNameRect.getWidth();
					
					startYPos+=laneHeight;
					
					lanesLayer.add(lane);
					lanesLayer.add(laneName);
					lanesLayer.add(laneNameRect);
				}
				
				//update the value of startXPos adding the laneNameRect.width()
				startXPos+=laneNameRectWidth;
				startYPos=pools[i].y;
				
				var poolLaneNameRectWidth=laneNameRectWidth+poolNameRect.getWidth();
				
				//Drawing phases
				var phases=pools[i].phases;
				for(var j=0;j<phases.length;j++){
					
					var phaseWidth=phases[j].percentWidth*(pools[i].width-poolLaneNameRectWidth)/100;
					
					var phase= new Kinetic.Rect({
						x:startXPos,
						y:startYPos,
						width: phaseWidth,
						height: pools[i].height,
						stroke: style.pool.fontColor,
						strokeWidth: 3
					});
					
					
					
					/*
					*	The folowing lines define the phase 
					*	name and its position
					*/
					var phaseName=new Kinetic.Text({
						text: phases[j].name,
						fontSize: style.pool.fontSize,
						fontFamily: style.pool.fontFamily
					});
					phaseName=new Kinetic.Text({
						x: startXPos+(phaseWidth-phaseName.getWidth())/2,
						y:startYPos+config.textMargin,
						text: phases[j].name,
						fontSize: style.pool.fontSize,
						fontFamily: style.pool.fontFamily,
						fill: style.pool.fontColor
					});
					
					startXPos+=phaseWidth;
					
					phasesLayer.add(phase);
					phasesLayer.add(phaseName);
					
					
				}
				
				
				poolsLayer.add(pool);
				poolsLayer.add(poolName);
				poolsLayer.add(poolNameRect);
				
			}
			/*
				Defining function for drawing arrow
			*/
			var drawArrow=function(endElem,points){
				var slope=(points[points.length-1]-points[points.length-3])*1.0/(points[points.length-2]-points[points.length-4]);
				var slope2=-1.0*(1/slope);
				var b=(Math.abs(slope)!=Infinity)?endElem.position.y-slope*endElem.position.x:endElem.position.y;
				var deltaXCircle=function (radius,slope){
					return radius*1.0*Math.sqrt(Math.pow(slope,2)+1)/(Math.pow(slope,2)+1);
				};
				var dx;
				var dx2;
				var dx3;
				//first for events end elems
				if(endElem.type==0 || endElem.type==1 || endElem.type==2){
					dx=deltaXCircle(radius,slope);
				}
				else if(endElem.type==3 || endElem.type==4){
					var width=endElem.width;
					var height=endElem.height;
					var dxi=width/2;
					var dyi=height/2;
					var c1=dxi/Math.cos(Math.atan(Math.abs(slope)));
					var c2=dyi/Math.sin(Math.atan(Math.abs(slope)));
					if(c1<=c2){
						dx=dxi;
					}
					else{
						dx=deltaXCircle(c2,slope);
					}
				}
				else if(endElem.type==5 || endElem.type==6 || endElem.type==7){
					
					var z=endElem.width/2;
					var point1={};
					var point2={};
					if(points[points.length-4]<points[points.length-2] && points[points.length-3]<points[points.length-1])
					{
						point1.x=endElem.position.x;
						point1.y=endElem.position.y-z;
						
						point2.x=endElem.position.x-z;
						point2.y=endElem.position.y;
					}
					else if(points[points.length-4]<points[points.length-2] && points[points.length-3]>points[points.length-1]){
						point1.x=endElem.position.x-z;
						point1.y=endElem.position.y;
						
						point2.x=endElem.position.x;
						point2.y=endElem.position.y+z;
					}
					else if(points[points.length-4]>points[points.length-2] && points[points.length-3]<points[points.length-1]){
						point1.x=endElem.position.x;
						point1.y=endElem.position.y-z;
						
						point2.x=endElem.position.x+z;
						point2.y=endElem.position.y;
					}
					else{
						point1.x=endElem.position.x+z;
						point1.y=endElem.position.y;
						
						point2.x=endElem.position.x;
						point2.y=endElem.position.y+z;
					}
					var slopeGate=(point2.y-point1.y)/(point2.x-point1.x);
					dx=((point1.y-b-slopeGate*point1.x)/(slope-slopeGate))-endElem.position.x;
					
				}
				dx2=deltaXCircle(15,slope);
				dx3=deltaXCircle(10,slope2);
				
				var posX;
				var posY;
				var posX2;
				var posY2;
				var posX3;
				var posY3;
				var posX4;
				var posY4;
				
				if(slope==Infinity){
					posX=endElem.position.x;
					posY=endElem.position.y-endElem.height/2;
					posX2=posX+10;
					posY2=posY-15;
					posX3=posX-10;
					posY3=posY-15;
				}
				else if(slope==-Infinity){
					posX=endElem.position.x;
					posY=endElem.position.y+endElem.height/2;
					posX2=posX+10;
					posY2=posY+15;
					posX3=posX-10;
					posY3=posY+15;
				}
				else if(slope2==Infinity){
					posX=endElem.position.x+dx;
					posY=endElem.position.y;
					posX2=posX+15;
					posY2=posY+10;
					posX3=posX+15;
					posY3=posY-10;
				}
				else if(slope2==-Infinity){
					posX=endElem.position.x-dx;
					posY=endElem.position.y;
					posX2=posX-15;
					posY2=posY+10;
					posX3=posX-15;
					posY3=posY-10;
				}
				else{
					posX=endElem.position.x-dx;
					if(!((posX>points[points.length-4] && posX<endElem.position.x) || (posX>endElem.position.x && posX<points[points.length-4]))){
						posX=endElem.position.x+dx;
					}
					posY=slope*posX+b;
					posX4=posX-dx2;
					if(!((posX4>points[points.length-4] && posX4<posX) || (posX4>posX && posX4<points[points.length-4]))){
						posX4=posX+dx2;
					}
					posY4=slope*posX4+b;
					var b2=posY4-slope2*posX4;
					posX2=posX4-dx3;
					posY2=slope2*posX2+b2;
					posX3=posX4+dx3;
					posY3=slope2*posX3+b2;
				}
				var arrow=new Kinetic.Shape({
					sceneFunc: function(context) {
						context.beginPath();
						context.moveTo(this.posX, this.posY);
						context.lineTo(this.posX2, this.posY2);
						context.lineTo(this.posX3, this.posY3);
						context.lineTo(this.posX, this.posY);
						context.closePath();
						// KineticJS specific context method
						context.fillShape(this);
					},
					fill: 'black'
				});
				arrow.posX=posX;
				arrow.posY=posY;
				arrow.posX2=posX2;
				arrow.posY2=posY2;
				arrow.posX3=posX3;
				arrow.posY3=posY3;
				return arrow;
			};
			
			/*
				Defining function for dragging elements
			*/
			var dragmove=function(){
				if(config.editable){
					config.skeleton.elems[this.i].position.x=this.original.x+this.getX();
					config.skeleton.elems[this.i].position.y=this.original.y+this.getY();
					
					for(var j=0;j<config.skeleton.wires.length;j++){
						var points=new Array();
						var endElem;
						var slope;
						if(config.skeleton.wires[j].start==config.skeleton.elems[this.i].id){
							points[points.length]=config.skeleton.elems[this.i].position.x;
							points[points.length]=config.skeleton.elems[this.i].position.y;
							if(config.skeleton.wires[j].breakPoints!=null){
								for(var k=0;k<config.skeleton.wires[j].breakPoints.length;k++){
										points[points.length]=config.skeleton.wires[j].breakPoints[k].x;
										points[points.length]=config.skeleton.wires[j].breakPoints[k].y;
								}
							}
							for(var k=0;k<config.skeleton.elems.length;k++){
								if(config.skeleton.elems[k].id==config.skeleton.wires[j].end){
									points[points.length]=config.skeleton.elems[k].position.x;
									points[points.length]=config.skeleton.elems[k].position.y;
									endElem=config.skeleton.elems[k]
								}
							}
							slope=(points[points.length-1]-points[points.length-3])*1.0/(points[points.length-2]-points[points.length-4]);
							config.skeleton.wires[j].line.setPoints(points);
						}
						else if(config.skeleton.wires[j].end==config.skeleton.elems[this.i].id){
							endElem=config.skeleton.elems[this.i]
							for(var k=0;k<config.skeleton.elems.length;k++){
								if(config.skeleton.elems[k].id==config.skeleton.wires[j].start){
									points[points.length]=config.skeleton.elems[k].position.x;
									points[points.length]=config.skeleton.elems[k].position.y;
								}
							}
							if(config.skeleton.wires[j].breakPoints!=null){
								for(var k=0;k<config.skeleton.wires[j].breakPoints.length;k++){
										points[points.length]=config.skeleton.wires[j].breakPoints[k].x;
										points[points.length]=config.skeleton.wires[j].breakPoints[k].y;
								}
							}
							points[points.length]=config.skeleton.elems[this.i].position.x;
							points[points.length]=config.skeleton.elems[this.i].position.y;
							slope=(points[points.length-1]-points[points.length-3])*1.0/(points[points.length-2]-points[points.length-4]);
							config.skeleton.wires[j].line.setPoints(points);
						}
						
						//drawing arrow
						if(endElem!=null){
							
							
							config.skeleton.wires[j].arrow.destroy();
							
							config.skeleton.wires[j].arrow=drawArrow(endElem,points);
							
							wiresLayer.add(config.skeleton.wires[j].arrow);
						}
						
					}
					wiresLayer.draw();
				}
			};
			
			var dragmoveBreakpoint=function(){
				if(config.editable){
					config.skeleton.wires[this.wire].breakPoints[this.breakPoint].x=this.getX();
					config.skeleton.wires[this.wire].breakPoints[this.breakPoint].y=this.getY();
					var points= [];
					var startElem;
					var endElem;
					for(var i=0;i<config.skeleton.elems.length;i++){
						if(config.skeleton.elems[i].id==config.skeleton.wires[this.wire].start)startElem=config.skeleton.elems[i];
						else if(config.skeleton.elems[i].id==config.skeleton.wires[this.wire].end)endElem=config.skeleton.elems[i];
					}
					
					points[points.length]=startElem.position.x;
					points[points.length]=startElem.position.y;
					if(config.skeleton.wires[this.wire].breakPoints!=null){
						for(var i=0;i<config.skeleton.wires[this.wire].breakPoints.length;i++){
							points[points.length]=config.skeleton.wires[this.wire].breakPoints[i].x;
							points[points.length]=config.skeleton.wires[this.wire].breakPoints[i].y;
						}
					}
					points[points.length]=endElem.position.x;
					points[points.length]=endElem.position.y;
					config.skeleton.wires[this.wire].line.setPoints(points);
					//drawing arrow
					if(endElem!=null){
						config.skeleton.wires[this.wire].arrow.destroy();
						config.skeleton.wires[this.wire].arrow=drawArrow(endElem,points);
						wiresLayer.add(config.skeleton.wires[this.wire].arrow);
					}
					wiresLayer.draw();
				}
			};
			
			//breakPoints mouse over and out events
			var dragMouseOver=function() {
				document.body.style.cursor = 'pointer';
				this.setStroke(style.drag.lineColor);
				this.setStrokeWidth(style.drag.lineWidth);
				breakPointsLayer.draw();
			};
			var dragMouseOut=function() {
				document.body.style.cursor = 'default';
				this.setStrokeWidth(0);
				this.setStroke("");
				breakPointsLayer.draw();
			  
			};
			
			//elems mouse over and out events
			var dragMouseOverElems=function() {
				document.body.style.cursor = 'pointer';
				this.originalStroke=(this.elem.getStroke()==null)?"":this.elem.getStroke();
				this.originalStrokeWidth=(this.elem.getStrokeWidth()==null)?0:this.elem.getStrokeWidth();
				this.elem.setStroke(style.drag.lineColor);
				this.elem.setStrokeWidth(style.drag.lineWidth);
				elemsLayer.draw();
			};
			var dragMouseOutElems=function() {
				document.body.style.cursor = 'default';
				this.elem.setStrokeWidth(this.originalStrokeWidth);
				this.elem.setStroke(this.originalStroke);
				elemsLayer.draw();
			  
			};
			
			
			
			//Drawing elements
			
			var elems=config.skeleton.elems;
			var picsElems= new Array();
			
			for(var i =0;i<elems.length;i++){
				var elem=elems[i];
				var elemType=this.elemTypes[elem.type];
				if(elem.id==null || elem.id=="")throw new Error(this.errors["elemIdNotValid"].replace("{0}",i));
				if(elemType==null)throw new Error(this.errors["elemTypeNotValid"].replace("{0}",elem.id));
				
				
				
				//Drawing events
				if(elemType.id==0 || elemType.id==1 || elemType.id==2 ){
					var fillColor;
					if(elemType.id==0)fillColor=style.otherElems.colors.start;
					else if(elemType.id==1)fillColor=style.otherElems.colors.normalEnd;
					else fillColor=style.otherElems.colors.terminalEnd;
					
					var event = new Kinetic.Circle({
						x:elem.position.x,
						y:elem.position.y,
						radius: radius,
						fill: fillColor
					});
					
					var eventName=new Kinetic.Text({
						text: elem.name,
						fontSize: style.otherElems.fontSize,
						fontFamily: style.otherElems.fontFamily
					});
					
					eventName=new Kinetic.Text({
						x: elem.position.x-eventName.getWidth()/2,
						y:elem.position.y + 18 +config.textMargin,
						text: elem.name,
						fontSize: style.otherElems.fontSize,
						fontFamily: style.otherElems.fontFamily,
						fill: style.otherElems.fontColor
					});
					
					var group = new Kinetic.Group({
						draggable:config.editable
					});
					group.add(event).add(eventName);
					
					//prepare dragmove
					group.original={
						x:elem.position.x,
						y:elem.position.y
					};
					group.elem=event;
					group.i=i;
					group.on("dragmove",dragmove);
					group.on("mouseover",dragMouseOverElems);
					group.on("mouseout",dragMouseOutElems);
					config.skeleton.elems[i].width=event.getWidth();
					config.skeleton.elems[i].height=event.getHeight();
					elemsLayer.add(group);
				}
				
				//Drawing gateways
				
				if(elemType.id==5 || elemType.id==6 || elemType.id==7){
					var gatewaysColor=style.otherElems.colors.gateway;
					var squareWidth=22*Math.sqrt(2);
					var gateway = new Kinetic.Rect({
						x:elem.position.x-squareWidth/2,
						y:elem.position.y-squareWidth/2,
						width: squareWidth,
						height: squareWidth,
						fill: gatewaysColor,
						rotation:45//Math.PI*1/4
					});
					gateway.move({x:squareWidth/2,y:(squareWidth/2)-(squareWidth*Math.sqrt(2)/2)});
					var gatewayName=new Kinetic.Text({
						text: elem.name,
						fontSize: style.otherElems.fontSize,
						fontFamily:style.otherElems.fontFamily
					});
					gatewayName=new Kinetic.Text({
						x: elem.position.x-gatewayName.getWidth()/2,
						y:elem.position.y + 22 +config.textMargin,
						text: elem.name,
						fontSize: style.otherElems.fontSize,
						fontFamily: style.otherElems.fontFamily,
						fill: style.otherElems.fontColor
					});
					
					var group = new Kinetic.Group({
						draggable:config.editable
					});
					
					group.add(gateway).add(gatewayName);
					
					if(elemType.id==6 || elemType.id==7){
						var line1 = new Kinetic.Line({
							points: [elem.position.x, elem.position.y-(0.8*squareWidth)/2, elem.position.x, elem.position.y+(0.8*squareWidth)/2],
							stroke: style.otherElems.colors.gatewayLine,
							strokeWidth:4,
							lineCap: 'round',
							lineJoin: 'round'
						});
						var line2 = new Kinetic.Line({
							points: [elem.position.x-(0.8*squareWidth)/2, elem.position.y, elem.position.x+(0.8*squareWidth)/2, elem.position.y],
							stroke: style.otherElems.colors.gatewayLine,
							strokeWidth:4,
							lineCap: 'round',
							lineJoin: 'round'
						});
						group.add(line1).add(line2);
					}
					
					if(elemType.id==7){
						var line3=new Kinetic.Line({
							points: [elem.position.x-(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.y-(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.x+(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.y+(0.8*squareWidth)*Math.sqrt(2)/4],
							stroke: style.otherElems.colors.gatewayLine,
							strokeWidth:4,
							lineCap: 'round',
							lineJoin: 'round'
						});
						var line4=new Kinetic.Line({
							points: [elem.position.x+(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.y-(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.x-(0.8*squareWidth)*Math.sqrt(2)/4, elem.position.y+(0.8*squareWidth)*Math.sqrt(2)/4],
							stroke:style.otherElems.colors.gatewayLine,
							strokeWidth:4,
							lineCap: 'round',
							lineJoin: 'round'
						});
						group.add(line3).add(line4);
					}
					
					//prepare dragmove
					group.original={
						x:elem.position.x,
						y:elem.position.y
					};
					group.elem=gateway;
					group.i=i;
					group.on("dragmove",dragmove);
					group.on("mouseover",dragMouseOverElems);
					group.on("mouseout",dragMouseOutElems);
					config.skeleton.elems[i].width=squareWidth*Math.sqrt(2);
					config.skeleton.elems[i].height=squareWidth*Math.sqrt(2);
					elemsLayer.add(group);
					
				}
				
				
				//drawing activities
				if(elemType.id==3 || elemType.id==4){
					var maxActivityWidth=200;
					var activityWidth;
					var tempText=new Kinetic.Text({
						text: elem.name,
						fontSize: style.activity.fontSize,
						fontFamily: style.activity.fontFamily
					});
					
					var group = new Kinetic.Group({
						draggable:config.editable
					});
					
					if(tempText.getWidth()>0.8*maxActivityWidth)
					{
						tempText=new Kinetic.Text({
							text: elem.name,
							fontSize: style.activity.fontSize,
							fontFamily: style.activity.fontFamily,
							width:0.8*maxActivityWidth
						});
					}
					
					var activity = new Kinetic.Rect({
						x:elem.position.x-(5.0*tempText.getWidth()/4.0)/2,
						y:elem.position.y-(5.0*tempText.getHeight()/3.0)/2,
						width: (5.0*tempText.getWidth()/4.0),
						height: (5.0*tempText.getHeight()/3.0),
						fill: style.activity.background,
						stroke: style.activity.colorStatus.notOpen, 
						strokeWidth: style.activity.borderWidth,
						cornerRadius:style.activity.borderRadious
					});
					
					tempText=new Kinetic.Text({
						x: elem.position.x-tempText.getWidth()/2,
						y:elem.position.y-tempText.getHeight()/2,
						text: elem.name,
						fontSize: style.activity.fontSize,
						fontFamily: style.activity.fontFamily,
						fill: style.activity.fontColor,
						width:0.8*maxActivityWidth
					});
					
					group.add(activity).add(tempText);
					
					//prepare dragmove
					group.original={
						x:elem.position.x,
						y:elem.position.y
					};
					
					group.elem=activity;
					group.i=i;
					config.skeleton.elems[i].width=activity.getWidth();
					config.skeleton.elems[i].height=activity.getHeight();
					group.on("dragmove",dragmove);
					group.on("mouseover",dragMouseOverElems);
					group.on("mouseout",dragMouseOutElems);
					elemsLayer.add(group);
				}
			}
			
			
			//drawing wires
			var wires=config.skeleton.wires;
			for(var i=0;i<wires.length;i++){
				var points= new Array();
				var wire=wires[i];
				var startElem;
				var endElem;
				for(var j=0;j<elems.length;j++){
					if(elems[j].id==wire.start)startElem=elems[j];
					else if(elems[j].id==wire.end)endElem=elems[j];
				}
				
				points[points.length]=startElem.position.x;
				points[points.length]=startElem.position.y;
				if(wire.breakPoints!=null){
					for(var j=0;j<wire.breakPoints.length;j++){
						points[points.length]=wire.breakPoints[j].x;
						points[points.length]=wire.breakPoints[j].y;
						
						//drawing break point drag circle
						// create circle
						var breakDragger = new Kinetic.Circle({
							x:wire.breakPoints[j].x,
							y:wire.breakPoints[j].y,
							radius: 12,
							draggable:config.editable
						});
						breakDragger.wire=i;
						breakDragger.breakPoint=j;
						breakDragger.original={
							x:wire.breakPoints[j].x,
							y:wire.breakPoints[j].y
						};
						breakDragger.on('dragmove',dragmoveBreakpoint);
						breakDragger.on('mouseover', dragMouseOver);
						breakDragger.on('mouseout', dragMouseOut);
						breakPointsLayer.add(breakDragger);
						
					}
				}
				points[points.length]=endElem.position.x;
				points[points.length]=endElem.position.y;
				
				
				var line1 = new Kinetic.Line({
					points: points,
					stroke: style.wire.regular.lineColor,
					strokeWidth:style.wire.regular.lineWidth,
					lineCap: 'round',
					lineJoin: 'round'
				});
				config.skeleton.wires[i].line=line1;
				
				//drawing arrow
				config.skeleton.wires[i].arrow=drawArrow(endElem,points);
				wiresLayer.add(config.skeleton.wires[i].arrow);
				
				wiresLayer.add(line1);
				
			}
			
			
			//Drawing logo
			if(config.showLogo){
				var imageObj = new Image();
				imageObj.onload = function() {
					var image = new Kinetic.Image({
						x: config.skeleton.width-config.logo.width,
						y: config.skeleton.height-config.logo.height,
						image: imageObj,
						width: config.logo.width,
						height: config.logo.height
					});
					logoLayer.add(image);
					stage.add(logoLayer);
				};
				imageObj.src = config.logo.url;
			}
			
			stage.add(poolsLayer).add(lanesLayer).add(phasesLayer).add(wiresLayer).add(breakPointsLayer).add(elemsLayer);
		}
		else{
			throw new Error(this.errors["containerNotExists"].replace("{0}",config.container));
		}
	},
	clear:function(container){
		var idDiag=this.exists(container);
		if(idDiag>-1){
			this.diagrams.splice(idDiag,1);
			if(document.getElementById(container)!=null){
				document.getElementById(container).innerHTML="";
			}
		}
	}
}