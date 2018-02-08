//object for storing game state and reducing use of global vars

Game = {
	camera: undefined, //stores camera
	renderer: undefined, //stores renderer
	projector: undefined, //stores projector
	scene: undefined,
	level: undefined, /*stores current level number
					   * 1 = 0 dimensions (point)
					   * 2 = 1 dimension (line)
					   * 3 = 2 dimension (area)
					   * 4 = 3 dimension (volume)
					   */
    score: undefined,
						
	lights : [], //stores lights objects
	points: [], //stores all the sphere objects (spheres are the points and contain info about position)
	//points.length replaces spheresPlaced
	cursor: undefined, //stores the circle used to place points
	box: undefined,
	animate: function(){
		requestAnimationFrame(Game.animate);
		Game.render();

		Game.view.stats.update();

	},

	render: function(){
		var timer = Date.now() * 0.0001;
		
		Game.camera.lookAt( Game.scene.position );

		if (Game.level == 4 && Game.camera.position.x <= 50){ //going into 3d
			Game.camera.position.add(new THREE.Vector3(0.4,-1.2,0));
		}

		Game.renderer.render( Game.scene, Game.camera );
	}
}

Game.view = { //stores objects for the HUD, may include popups, scores, etc.
	container: undefined, //replaces container
	stats: undefined, //replaces stats
	problem: undefined, //tells what the user needs to do
	controls: undefined, //tells how the user controls the game (arrow keys, etc)
	message: undefined, //the popup to display the message after the problem
	values: undefined, //information about points/lengths/areas for user
}


Game.grid = { //stores grid data; replaces grid, gridSize and gridStep
	size: 400, //in either direction
	step: 80,
	//number of points = size/step
	object: undefined,
}

Game.goal = { //the values (points, areas, lengths, volumes) that the user is supposed to match
	level1: {
		x: undefined, 
		y: undefined
	},
	level2: undefined, //a distance, stored as coefficient and number inside radical
	level3: {
		area: undefined,
		multiplier: undefined,
		inverseSlope: undefined
	}, 
	level4: undefined //a volume

}

Game.init = function(){
	Game.view.container = document.createElement('div');
	document.body.appendChild(Game.view.container);

	//setting up camera
	Game.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, -1000, 1500 );
	Game.camera.position.x = 0;
	Game.camera.position.y = 200;
	Game.camera.position.z = 50;

	Game.scene = new THREE.Scene();

	//creating grid
	Game.grid.object = new THREE.GridHelper(Game.grid.size, Game.grid.step);
	Game.scene.add(Game.grid.object);

	//getting random goal point
	Game.goal.level1.x = (Math.floor((Math.random() * 10) + 1)-5);
	Game.goal.level1.y = (Math.floor((Math.random() * 10) + 1)-5);


	// // text for instructions
	// var text2 = document.createElement('div');
	// text2.style.position = 'absolute';
	// //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
	// text2.style.width = 100;
	// text2.style.height = 100;
	// text2.style.backgroundColor = "clear";
	// text2.innerHTML = "Place a point at (" + Game.goal.level1.x + "," + -1 * Game.goal.level1.y + ")" ;
	// text2.style.top = 0 + 'px';
	// text2.style.left = 200 + 'px';
	// document.body.appendChild(text2);

	//creating materials, adding cursor
	var material = new THREE.MeshBasicMaterial( {  color: 0x7e7bba, wireframe: true, wiframeLinewidth: 1} );
	var circleGeometry = new THREE.SphereGeometry(30, 16, 1); //arguments: radius, segments, segments
	Game.cursor = new THREE.Mesh(circleGeometry, material);
	Game.scene.add( Game.cursor);
	Game.cursor.scale.y = 0.01;
	Game.cursor.position.x = 0; 
	Game.cursor.position.y = 0;
	Game.cursor.position.z = 0;

	//////ADDING LIGHTS
	var ambientLight = new THREE.AmbientLight( Math.random() * 0x10 );
	Game.scene.add( ambientLight );
	Game.lights.push(ambientLight);

	var directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	Game.scene.add( directionalLight );
	Game.lights.push(directionalLight);

	directionalLight = new THREE.DirectionalLight( Math.random() * 0xffffff );
	directionalLight.position.x = Math.random() - 0.5;
	directionalLight.position.y = Math.random() - 0.5;
	directionalLight.position.z = Math.random() - 0.5;
	directionalLight.position.normalize();
	Game.scene.add( directionalLight );
	Game.lights.push(directionalLight);
	////

	//adding renderer
	Game.renderer = new THREE.CanvasRenderer();
	Game.renderer.setClearColor( 0xf0f0f0 );
	Game.renderer.setSize( window.innerWidth, window.innerHeight );

	Game.view.container.appendChild( Game.renderer.domElement );

	//adding stats (the fps meter)
	Game.view.stats = new Stats();
	Game.view.stats.domElement.style.position = 'absolute';
	Game.view.stats.domElement.style.top = '0px';
	Game.view.container.appendChild( Game.view.stats.domElement );

	//adding projector for raycasting
	Game.projector = new THREE.Projector();

	//binding events
	window.addEventListener( 'resize', onWindowResize, false );
	Game.renderer.domElement.addEventListener( 'mousedown', onMouseDown );
	document.addEventListener('keydown', onKeyDown);

	Game.level = 0; //start at 0, change to 1
	Game.score = 0;
	$("#score > p:nth-child(2)").text(Game.score);
	$(".popup").hide();
	changeLevel();
} 


function onKeyDown(event){
	//get key pressed and move circle accordingly
	var key = event.keyCode;
	var speed = Game.grid.step;
	var isLowLevel = (Game.level<=3);
	var isArrow = false; // did they press an arrow key?


	if ( key==37 ) { //LEFT key
	 	isArrow = true;
		if ((Game.cursor.position.x - speed) >= -Game.grid.size && isLowLevel){
			Game.scene.add(Game.cursor);
			Game.cursor.position.x -= speed;
		}
	} else if (key == 39) {	 //RIGHT key
		isArrow = true;
		if ((Game.cursor.position.x + speed) <= Game.grid.size && isLowLevel){
			Game.scene.add(Game.cursor);
			Game.cursor.position.x += speed;
		}
	} else if (key == 40) { //DOWN key
		isArrow = true;
		if ((Game.cursor.position.z + speed) <= Game.grid.size && isLowLevel){
			Game.scene.add(Game.cursor);
			Game.cursor.position.z += speed;
		} else if (!isLowLevel && Game.box.geometry.vertices[0].y > Game.grid.step ){
			Game.box.geometry.vertices[4].y -= Game.grid.step; //y is flipped
			Game.box.geometry.vertices[1].y -= Game.grid.step;
			Game.box.geometry.vertices[0].y -= Game.grid.step;
			Game.box.geometry.vertices[5].y -= Game.grid.step;

		}
		$("#values > #height").text("Box height: "+ Game.box.geometry.vertices[0].y/Game.grid.step);
	} else if (key == 38) { //UP key
		isArrow = true;
		if ((Game.cursor.position.z - speed) >= -Game.grid.size && isLowLevel ){
			Game.scene.add(Game.cursor);
			Game.cursor.position.z -= speed;
		} else if (!isLowLevel && Game.box.geometry.vertices[0].y <= 6*Game.grid.step){
			Game.box.geometry.vertices[4].y += Game.grid.step;
			Game.box.geometry.vertices[1].y += Game.grid.step;
			Game.box.geometry.vertices[0].y += Game.grid.step;
			Game.box.geometry.vertices[5].y += Game.grid.step;
		}
		$("#values > #height").text("Box height: "+ Game.box.geometry.vertices[0].y/Game.grid.step)
	} else if (key == 13 && $(".popup").attr("id") == "problem" && $(".modal").css('opacity') == "0") { //ENTER key
		newSphere = new Point(Game.cursor.position);
		Game.points.push(newSphere);
//		Game.scene.remove(Game.cursor);
		if (Game.points.length == 1){
			
			cursorLine(0,0,0);
		}else{
			cursorLine(Game.points[1].position);
		}

		if (Game.level != 3 || Game.points.length == 4){ // level 3 requires 2 points to be plotted
			check();
		}
	} else if (key == 8) { //BACKSPACE key
		if($(".popup").attr("id") == "incorrect"){
			if (Game.points.length > 0){
				
				Game.scene.remove( Game.points[Game.points.length - 1] ); //removes most recent point
				Game.points.pop(); //removes last element from array
			}	
			if (Game.level != 3 || Game.points.length == 2){
				displayProblem();
			}
		}
 	} else if (key == 32){ //SPACE
 		if($(".popup").attr("id") == "correct" && Game.level <= 4){
 			changeLevel();
		}
 	}

 	if (isArrow && (Game.points.length == 1)) {
 		// console.log("cursor");
 		cursorLine(Game.cursor.position);
 	} else if(Game.points.length > 1){
 		//console.log("point");
 		cursorLine(Game.points[1].position);
 	}

	
	//console.log(Game.cursor.position.x + " " + Game.cursor.position.y + " " + Game.cursor.position.z);
}

function onWindowResize(){
	Game.camera.left = window.innerWidth / - 2;
	Game.camera.right = window.innerWidth / 2;
	Game.camera.top = window.innerHeight / 2;
	Game.camera.bottom = window.innerHeight / - 2;

	Game.camera.updateProjectionMatrix();

	Game.renderer.setSize( window.innerWidth, window.innerHeight );

}

function onMouseDown( event_info ) {
	if($(".popup").attr("id") == "correct"){
		changeLevel();
	}

    //-------detecting click on any object--------
    //For OrthographicCamera
    //    var vector = new THREE.Vector3(
	//     ( event.clientX / window.innerWidth ) * 2 - 1,
	//     - ( event.clientY / window.innerHeight ) * 2 + 1, 0.5 
	// );

	// use picking ray since it's an orthographic camera
	// var ray = Game.projector.pickingRay( vector, Game.camera );

	// replace <object> with whatever object for which you need to detect clicks

	//var intersect = ray.intersectObject( <object> );

	// if ( intersect.length > 0 ) {

	//     console.log("hit");

	// }
    
}


function Point(posVector3){ //creates a new point (sphere) with the specified position, and adds it to the scene
	var geometry = new THREE.SphereGeometry(15, 16, 16); //arguments are radius, vertical segments and horizontal segments
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: 0.5 } );
	sphere = new THREE.Mesh(geometry, material);
	sphere.position.copy(posVector3);
	Game.scene.add(sphere);
	//sphere.position.copy(posVector3);
	
	return sphere;
}


function check(){
	//remember that all points user makes must be divided by the grid step to get the points stored as goal
	var success;
	switch (Game.level){
		case 1:
			if (Game.points[0].position.x/Game.grid.step == Game.goal.level1.x && Game.points[0].position.z/Game.grid.step == Game.goal.level1.y){ //z point is negative to match coordinate plane
				success = true;
			} else {
				sucess = false;
			}
			break;
		case 2:
			var distance = Mathx.distance({x: Game.points[0].position.x/Game.grid.step, y: Game.points[0].position.z/Game.grid.step}, {x: Game.points[1].position.x/Game.grid.step, y: Game.points[1].position.z/Game.grid.step});
			distance = Mathx.antiRad(distance);
			console.log(distance);
			if (distance == Mathx.antiRad(Game.goal.level2)){
				success = true;
			} else {
				success = false;
			}
			break;
		case 3:
			sucess = false;
			// var point1 = Game.points[0].position;
			// var point2 = Game.points[1].position;

			var point3 = Game.points[2].position;
			var point4 = Game.points[3].position;

			// point1 = {
			// 	x: point1.x/Game.grid.step,
			// 	y: point1.z/Game.grid.step
			// };

			// point2 = {
			// 	x: point2.x/Game.grid.step,
			// 	y: point2.z/Game.grid.step
			// };
			point3 = {
				x: point3.x/Game.grid.step,
				y: -point3.z/Game.grid.step
			};

			point4 = {
				x: point4.x/Game.grid.step,
				y: -point4.z/Game.grid.step
			};
			
			var adjacentPt;
			if (Mathx.antiRad(Mathx.distance(point3, {x:Game.points[0].position.x/Game.grid.step, y:-Game.points[0].position.z/Game.grid.step})) 
				< Mathx.antiRad(Mathx.distance(point4, {x:Game.points[0].position.x/Game.grid.step, y:-Game.points[0].position.z/Game.grid.step}))){
				adjacentPt = point3;
				console.log("point3");
			} else {
				adjacentPt = point4;
				console.log("point4");
			}

			var perpendicular = false;
			var slope1 = Mathx.slope(adjacentPt, {x: Game.points[0].position.x/Game.grid.step, y: -Game.points[0].position.z/Game.grid.step}).value;
			var slope2 = Mathx.slope({x: Game.points[1].position.x/Game.grid.step, y: -Game.points[1].position.z/Game.grid.step}, {x: Game.points[0].position.x/Game.grid.step, y: -Game.points[0].position.z/Game.grid.step}).value;
			console.log(slope1 + ", " + slope2);
			if (slope1 == -1 * Math.pow(slope2, -1) || (slope1 == Infinity && slope2 == 0) || (slope1==0 && slope2 == Infinity)){
				perpendicular = true;
			}
			
			if( Game.goal.level3.area == Math.pow(Math.pow(Game.goal.level2.coefficient, 2) * Game.goal.level2.radical * 
				Mathx.antiRad(Mathx.distance(adjacentPt, {x:Game.points[0].position.x/Game.grid.step, y:-Game.points[0].position.z/Game.grid.step}))
			,0.5) && perpendicular){ //make sure the area is correct and adjacent sides are perpendicular
				success = true;
			}
			

			break;
		case 4:
			var userHeight = Game.box.geometry.vertices[0].y/Game.grid.step; //could be vertices 1, 4, 5 instead (any one of the top)
			var area = Game.goal.level3.area;
			var userVolume = userHeight * area;
			if (userVolume == Game.goal.level4){
				success = true;
			}
			break;
	}
	
	displayMessage(success);
	console.log(success);
	Game.score += success? 100: -20;
	$("#score > p:nth-child(2)").text(Game.score);
	return success;
}

function changeLevel(){ //case # is the level before the one to be changed to
	switch (Game.level){
		case 0: //change to level 1
			Game.goal.level1.x = Math.floor((Math.random() * 10) + 1)-5;
			Game.goal.level1.y = Math.floor((Math.random() * 10) + 1)-5; 
			// Game.goal.level1.x = 1; // TESTING FORCE
			// Game.goal.level1.y = -2; 
			Game.view.problem = "Plot a point at (" + Game.goal.level1.x + ", " + -Game.goal.level1.y + ")";
			break;
		case 1:
			$("#values").show();
			$("#values > #point").show();
			var text = $("#values > #point").text();
			$("#values > #point").text(text + "(" + Game.goal.level1.x + ", " + -Game.goal.level1.y + ")");

			//assume correct point
			var pointX = Game.points[0].position.x/Game.grid.step;
			var pointY = Game.points[0].position.z/Game.grid.step;
			var newX = Math.floor((Math.random() * 10) + 1)-5;
			var newY = Math.floor((Math.random() * 10) + 1)-5;
			var isSoultionsArray = Mathx.findLimits(Mathx.slope({x: -1 * pointY, y: pointX}, {x: -1 * newY, y: newX}),{x:pointX, y:pointY}, {x:newX, y:newY});
			console.log(isSoultionsArray.length);
			while((newX == pointX && newY == pointY) || (isSoultionsArray.length == 0)){
				newX = Math.floor((Math.random() * 10) + 1)-5;
				newY = Math.floor((Math.random() * 10) + 1)-5;
				isSoultionsArray = Mathx.findLimits(Mathx.slope({x: -1 * pointY, y: pointX}, {x: -1 * newY, y: newX}),{x:pointX, y:pointY}, {x:newX, y:newY});
				console.log(isSoultionsArray.length);
			}


			Game.goal.level2 = Mathx.distance({x: pointX, y: pointY}, {x: newX, y: newY});
			//Game.goal.level2 = Mathx.distance({x: 0, y: 0}, {x: 1, y: 0});
			//Game.view.problem = "Plot another point to form a line with length \(\frac{\sqrt{3}}{2}\)";
			// Game.goal.level2.coefficient = 2; // TESTING FORCE
			// Game.goal.level2.radical = 2; 
			if (Game.goal.level2.radical == 1){
				if (Game.goal.level2.coefficient == '\0'){
					Game.view.problem = "Plot another point to form a line with length 1";
				} else {
					Game.view.problem = "Plot another point to form a line with length " + Game.goal.level2.coefficient;
				}
			} else {
				Game.view.problem = "Plot another point to form a line with length " + Game.goal.level2.coefficient + "\u221A" + Game.goal.level2.radical;
			}
			break;

		case 2: //change to level 3 (area)
			$("#values > #point").hide();
			$("#values > #line").show();
			var text = $("#values > #line").text();

			if (Game.goal.level2.radical == 1){
				if (Game.goal.level2.coefficient == '\0'){
					//Game.view.problem = "Plot another point to form a line with length 1";
					$("#values > #line").text(text + "1");

				} else {
					$("#values > #line").text(text + Game.goal.level2.coefficient);
				}
			} else {
				$("#values > #line").text(text + Game.goal.level2.coefficient + "\u221A" + Game.goal.level2.radical);
			}


			var point1 = Game.points[0].position;
			var point2 = Game.points[1].position;
			
			point1 = {
				x: point1.x/Game.grid.step,
				y: point1.z/Game.grid.step
			};

			point2 = {
				x: point2.x/Game.grid.step,
				y: point2.z/Game.grid.step
			};

			Game.goal.level3.inverseSlope = Mathx.slope({x: -1 * point1.y, y: point1.x}, {x: -1 * point2.y, y: point2.x});
			var solutions = Mathx.findLimits(Game.goal.level3.inverseSlope, point1, point2);
			var solutionStemPoints = solutions[Mathx.getRandomInt(0, solutions.length - 1)];
			Game.goal.level3.area = Math.pow(Math.pow(Game.goal.level2.coefficient, 2) * Game.goal.level2.radical * Math.min(
				Mathx.antiRad(Mathx.distance({x:solutionStemPoints[0],y:solutionStemPoints[1]}, {x:Game.points[0].position.x/Game.grid.step, y:-Game.points[0].position.z/Game.grid.step})),
				Mathx.antiRad(Mathx.distance({x:solutionStemPoints[2],y:solutionStemPoints[3]}, {x:Game.points[0].position.x/Game.grid.step, y:-Game.points[0].position.z/Game.grid.step}))
			),0.5);


			/*var shiftedLine = solutions[Mathx.getRandomInt(0, solutions.length - 1)]; //pick one of the possible solutions
			console.log(shiftedLine);
			var newPoint1 = new Point({
				x: shiftedLine[0] * Game.grid.step,
				y: 0,
				z: shiftedLine[1] * -Game.grid.step
			});
			var newPoint2 = new Point({
				x: shiftedLine[2] * Game.grid.step,
				y: 0,
				z: shiftedLine[3] * -Game.grid.step
			});*/ //possibe answer code
			// Game.goal.level3.area = 8; // TESTING FORCE 
			Game.view.problem = "Plot two more points to create a rectangle with area " + Game.goal.level3.area;
			break;
		case 3:
			$("#values > #line").hide();
			$("#values > #area").show();
			var text = $("#values > #area").text();
			$("#values > #area").text(text + Game.goal.level3.area);
			$("#values > #height").show();
			var text = $("#values > #height").text();
			$("#values > #height").text(text + "1");

			var geometry = new THREE.BoxGeometry( 200, 100, 200 );
			for ( var i = 0; i < geometry.faces.length; i += 2 ) {

					var hex = Math.random() * 0xffffff;
					geometry.faces[ i ].color.setHex( hex );
					geometry.faces[ i + 1 ].color.setHex( hex );

			}
			var botRDis = [];
			var botLDis = [];
			var topRDis = [];
			var topLDis = [];
			for ( var loop1 = 0; loop1 < Game.points.length; loop1++ ){
				// console.log(Mathx.distance({x: 5, y: -5},{x:Game.points[loop1].x/Game.grid.step, y:-Game.points[loop1].z/Game.grid.step} ));
				// console.log(Mathx.antiRad(Mathx.distance({x: 5, y: -5},{x:Game.points[loop1].position.x/Game.grid.step, y:-Game.points[loop1].position.z/Game.grid.step} )));
				botRDis[loop1] = Mathx.antiRad(Mathx.distance({x: 5, y: -5},{x:Game.points[loop1].position.x/Game.grid.step, y:-Game.points[loop1].position.z/Game.grid.step} ));
			}
			var indexBotR = botRDis.indexOf(Math.min.apply(Math,botRDis))
			var botR = Game.points[indexBotR].position;
			geometry.vertices[2].copy(botR);
			geometry.vertices[0].copy(botR);
			geometry.vertices[0].y = 1*Game.grid.step; 
			for ( var loop2 = 0; loop2 < Game.points.length; loop2++ ){
				if(indexBotR!=loop2){
					botLDis[loop2] = Mathx.antiRad(Mathx.distance({x: -5, y: -5},{x:Game.points[loop2].position.x/Game.grid.step, y:-Game.points[loop2].position.z/Game.grid.step} ));
				}else{
					botLDis[loop2] = 666;
				}
			}
			var indexBotL = botLDis.indexOf(Math.min.apply(Math,botLDis)) 
			var botL = Game.points[indexBotL].position;
			geometry.vertices[7].copy(botL);
			geometry.vertices[5].copy(botL);
			geometry.vertices[5].y = 1*Game.grid.step;
			for ( var loop3 = 0; loop3 < Game.points.length; loop3++ ){
				if(indexBotR!=loop3 && indexBotL != loop3){
					topRDis[loop3] = Mathx.antiRad(Mathx.distance({x: 5, y: 5},{x:Game.points[loop3].position.x/Game.grid.step, y:-Game.points[loop3].position.z/Game.grid.step} ));
				} else {
					topRDis[loop3] = 777;
				}
			}
			var indexTopR = topRDis.indexOf(Math.min.apply(Math,topRDis))
			var topR = Game.points[indexTopR].position;
			geometry.vertices[3].copy(topR);
			geometry.vertices[1].copy(topR);
			geometry.vertices[1].y = 1*Game.grid.step;
			for ( var loop4 = 0; loop4 < Game.points.length; loop4++ ){
				if(indexBotR != loop4 && indexBotL != loop4 && indexTopR != loop4){
					topLDis[loop4] = Mathx.antiRad(Mathx.distance({x: -5, y: 5},{x:Game.points[loop4].position.x/Game.grid.step, y:-Game.points[loop4].position.z/Game.grid.step} ));
				} else {
					topLDis[loop4] = 888;
				}				
			}
			var indexTopL = topLDis.indexOf(Math.min.apply(Math,topLDis)) 

			// console.log(botRDis);
			// console.log(Math.min.apply(Math,botRDis));
			// console.log(botRDis.indexOf(Math.min.apply(Math,botRDis)));
			
			
			
			
			console.log(botRDis,botLDis,topRDis,topLDis);
			
			
			
			
			
			
			
						
			var topL = Game.points[indexTopL].position;
			console.log(botR,botL,topR,topL);
			console.log(botRDis,botLDis,topRDis,topLDis);
			

			//geometry.vertices[1] = Game.points[1].position; 
			//geometry.vertices[2] = Game.points[2].position; 
			
			
			
			
			

			geometry.vertices[6].copy(topL);
			geometry.vertices[4].copy(topL);
			geometry.vertices[4].y = 1*Game.grid.step;
			
			
			
			
			
			

			var material = new THREE.MeshBasicMaterial( {vertexColors: THREE.FaceColors} );
			var rect = new THREE.Mesh( geometry, material );
			Game.box = rect;
			Game.scene.add( rect );

			var area = Game.goal.level3.area;
			//remember current range of box height is 1 to 6
			var height = Mathx.getRandomInt(1,6);
			Game.goal.level4 = area * height;
			Game.view.problem = "Use <span class = 'key'>\u2191</span> and <span class = 'key'>\u2193</span> keys to form a box with volume " + Game.goal.level4;
			break;
		case 4: //end of game

			break;
	}
	if (Game.level < 4){
		displayProblem();
	} else {

	}
	Game.level++;
	if (Game.level == 5){
		finish();
	}
	displayHelp();
	
}

function displayProblem(){ //displays the values that the user needs to achieve
	$(".popup > h1").html(Game.view.problem);
	$(".popup").attr("id", "problem");
	$(".popup").show();
}

function displayMessage(success){ //tells the result of the user's solution
	var message;
	var newCSS; //see style.css, .popup.incorrect and .popup.correct
	if (success){
		message = "Well done!";
		newCSS = "correct";
		
	} else { //display message as clone, below problem, so they can continue to work

		message = "Sorry, try again.";
		newCSS = "incorrect";

	}
	$(".popup").attr("id", newCSS);
	$(".popup > h1").text(message);
}

function displayHelp(){
	var html; //to go inside help content div
	switch (Game.level){
		case 1: 
			html = "<img src = './coordinate-plane.png' width = '100%'/>\
			<h3>Example:</h3>\
			<h3>Plot a point at (3, 4)</h3>\
			<p>Move the cursor 3 times to the right and 4 times up </p>\
			<p> Hit ENTER </p>";

			break;
		case 2:
			html = "<img src = './Distance-formula.png' width = 100%/>\
			<p>This level uses the distance formula or Pythagorean Theorem.</p>\
			<h3>Example:</h3>\
			<h3>Plot another point to form a line with distance 2\u221A5</h3>\
			<ol>\
				<li> 2\u221A5 = \u221A4*\u221A5 = \u221A20 </li>\
				<li> Find two numbers, the sum of whose squares is equal to 20 </li>\
				<li> 20 = 16 + 4 so these numbers are 4 and 2 </li>\
				<li> Move the cursor 4 times on one axis and then 2 times on the other axis</li>\
				<li> Hit ENTER </li>\
			</ol>";
			break;
		case 3:
			html = "<img src = './rectangle-area.jpg' width = '100%'/>\
			<h3>Example:</h3>\
			<h3>Plot two more points to create a rectangle with area 10</h3>\
			<ol>\
				<li>Divide the area by the first side length like this: <br>10 / 2\u221A5 = \u221A5</li>\
				<li>Form two new sides that have length \u221A5</li>\
				<li>Since it's a rectangle, each side is perpendicular to those next to it. This means it's slope is the negative reciprocal</li>\
				<li>If the slope of the first side is 2 (up 2 over 1), this new side must be -1/2 (down 1, over 2)</li>\
				<li>Starting from each of the two points, move the cursor down 1 and over 2 and hit ENTER each time</li>\
			</ol>";
			break;
		case 4:
			html = "<h3>Example:</h3>\
			<h3>Form a box with volume 20</h3>\
			<ol>\
				<li>Divide the volume by the area of the rectangle from the previous level</li>\
				<li>This is the height of the box.</li>\
				<li>Use the arrow keys to change the height. Hit <span class = 'key'>enter</span></li>\
			</ol>";

	}
	
	$("#helpBox").width('100px');
	$("#helpBox > .content").slideUp(); //hide so the level starts without help
	$("#helpBox > .content").html(html);
}

function finish(){
	console.log("end game");
	$("#openModal > div").html("\
		<h1> Great Job!</h1>\
		<h1 style = 'font-weight:normal;'> Score: " + Game.score + 
		"</h1>\
		<a href = '#' class='button button-1' onClick='reload()'>Play Again</a>\
		");
	$("#openModal").show();
	$("#openModal").css('opacity', '1.0');
}

function cursorLine(hold){ //TODO 
	// var length = 5;
	var geometry = new THREE.Geometry();

	
	geometry.vertices.push(hold);
	// geometry.vertices[0].copy(hold);
	// geometry.vertices[1].copy(Game.points[0].position);
	geometry.vertices.push(Game.points[0].position);
	//console.log(geometry.vertices);
	// var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
	// var cube = new THREE.Mesh( geometry, material );
	// Game.scene.add( cube );
	// console.log(geometry.vertices);
	var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.5 } ) );
	Game.scene.add( line );
}