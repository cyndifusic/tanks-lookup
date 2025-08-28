import { layouts0, layouts1, param } from "./layouts.js";

var debugLog = function(str) {
	document.getElementById("console").innerHTML += str+"<br>";
}

var swapButton = document.getElementById("swap");
var nextMissionButton = document.getElementById("nextMission");
var previousMissionButton = document.getElementById("previousMission");
var jumpButton = document.getElementById("jump");
var searchButton = document.getElementById("clSearch");
var missionInput = document.getElementById("typeMission");
var info = document.getElementById("info");
var outerShell = document.getElementById("outerShell");
var permutations = document.getElementById("permutations");

var currentMission = 1;
var aspectRatio = -1;
var minLayout = param[422 + (22 * (currentMission - 1)) + 17];
var maxLayout = param[422 + (22 * (currentMission - 1)) + 18];
var selectedLayout = minLayout;
var hexString = [layouts0, null, layouts1][aspectRatio+1][selectedLayout];

var decArray = [];
var parsedArray = [];
var spawnLocations = [null, null, null, null, null, null, null, null];
var width;
var height;
var table;
var missionPane;

for (let i = 0; i < 8; i++) {
	let newBox = document.createElement("div");
	newBox.className = "colorsBox";
	newBox.id = i + "b";
	let image = document.createElement("img");
	image.src = "enemy_tank_" + i + ".png";
	newBox.appendChild(image);
	document.getElementById("colors").appendChild(newBox);
}

var createTable = function(width, height, needsImages, cellClassName) {
	var out = document.createElement("tbody");

	for (let i = 0; i < height; i++) {
		var newRow = document.createElement("TR");
		for (let n = 0; n < width; n++) {
			var newBox = document.createElement("TD");
			newBox.className = cellClassName;
			var newDiv = document.createElement("div");		

			if (needsImages) {
				var image = document.createElement("img");
				image.id = (n + (i * width)).toString();
				newDiv.appendChild(image);
			} else {
				newBox.id = (n + (i * width)).toString() + "c";
			}

			newBox.appendChild(newDiv);
			newRow.appendChild(newBox);
		}

		out.appendChild(newRow);
	}

	return out;
}

var clTable = function() {
	document.getElementById("clTable").appendChild(createTable(10, 10, false, "clSquare"));

	var clCells = [...document.getElementsByClassName("clSquare")];

	for (let i = 0; i < clCells.length; i++) {
		clCells[i].addEventListener("mouseover", clColorHover);
		clCells[i].addEventListener("mouseout", clColorOut);
		clCells[i].addEventListener("click", clColorClick);
	}
}

var drawBoard = function(missionChanged) {
	
	decArray = [];
	parsedArray = [];
	var colorCounts = [];
	var permutationCount = 1;

	if (table != null) {
		table.remove();
	}

	for (let i = 0; i < hexString.length; i += 3) {
		decArray.push(parseInt(hexString.slice(i, i+2), 16));
	}

	for (let i = 0; i < decArray.length; i += 4) {
		let temp = [];

		switch(decArray[i+2]) {
			case 0:
				temp.push(false);
				break;

			case 1:
				temp.push(true);
				break;
		}

		temp.push(decArray[i+3]);
		parsedArray.push(temp);
	}

	table = createTable(parsedArray[0][1], parsedArray[1][1], true, "square");

	document.getElementById("outerTable").appendChild(table);

	for (let i = 0; i < parsedArray.length; i++) {
		let x = parsedArray[i][1];
		let y = document.getElementById(i-4);
		if (x == 44) {
			y.src = "blue_tank.png";
		} else if (x >= 101 && x <= 107) {
			y.src = "block_cork.png";
			let stack = document.createElement("span");
			stack.innerHTML = (x - 100).toString();
			y.parentNode.appendChild(stack);
		} else if (x >= 144 && x <= 151) {
			y.src = "enemy_tank.png";
			let stack = document.createElement("span");
			stack.innerHTML = (x - 144).toString();
			stack.className = "enemy";
			y.parentNode.appendChild(stack);
			spawnLocations[x - 144] = i - 4;
		} else if (x == 200) {
			y.src = "hole.png";		
		} else if (x >= 201 && x <= 207) {
			y.src = "block_solid.png";
			let stack = document.createElement("span");
			stack.innerHTML = (x - 200).toString();
			y.parentNode.appendChild(stack);
		}
	}

	let leftovers = [...document.getElementsByClassName("overlapping")].concat([...document.getElementsByClassName("colorPane")]);
	for (let i = 0; i < leftovers.length; i++) {
		leftovers[i].remove();
	}

	for (let i = 422 + (22 * (currentMission - 1)) + 1; i < 422 + (22 * (currentMission - 1)) + 9; i++) {
		let j = i - (422 + (22 * (currentMission - 1)) + 1);
		let tankColors = [null, "#ad8242", "#7b7163", "#4a8e7b", "#ce5973", "#e6d242", "#845984", "#5a9e4a", "#efe4ba", "#3a3531"];
		if (param[i] == 0) {

			let image = document.createElement("img");
			image.className = "overlapping";
			image.src = "x.png";
			document.getElementById(spawnLocations[j].toString()).parentNode.appendChild(image);

			let image2 = document.createElement("img");
			image2.className = "overlapping";
			image2.src = "x_full.png";
			document.getElementById(j.toString() + "b").appendChild(image2);
			document.getElementById(j.toString() + "b").style.backgroundColor = "white";

		} else if (param[i] < 10) {

			document.getElementById(spawnLocations[j].toString()).style.backgroundColor = tankColors[param[i]];
			document.getElementById(j.toString() + "b").style.backgroundColor = tankColors[param[i]];

		} else {

			let image = document.createElement("img");
			image.className = "overlapping";
			image.src = "question_mark.png";
			document.getElementById(spawnLocations[j].toString()).parentNode.appendChild(image);

			let image2 = document.createElement("img");
			image2.className = "overlapping";
			image2.src = "question_mark_full.png";
			document.getElementById(j.toString() + "b").appendChild(image2);
			document.getElementById(j.toString() + "b").style.backgroundColor = "white";

			let min = parseInt(param[i].toString().charAt(0));
			let max = parseInt(param[i].toString().charAt(1));
			colorCounts.push(max - min + 1);
			for (let k = min; k <= max; k++) {
				let newColorPane = document.createElement("div");
				newColorPane.className = "colorPane";
				newColorPane.style.backgroundColor = tankColors[k];
				if (k == max) {
					newColorPane.style.marginBottom = "20px";
				}
				document.getElementById(j.toString() + "b").appendChild(newColorPane);
				
			}
		}
	}

	if (missionChanged) {
		if (missionPane != null) {
			missionPane.remove();
		}

		missionPane = document.createElement("div");
		missionPane.id = "missionPane";

		for (let i = minLayout; i <= maxLayout; i++) {
			let newBox = document.createElement("div");
			newBox.className = "layoutSelect";
			newBox.id = i.toString() + "a";
			if (i == selectedLayout) {
				newBox.classList.add("selected");
			}
			newBox.addEventListener("click", changeLayout);

			let numberText = document.createElement("h2");
			numberText.innerHTML = i;
			newBox.appendChild(numberText);
			missionPane.appendChild(newBox);
		}

		outerShell.appendChild(missionPane);
	}

	info.innerHTML = "Aspect Ratio: " + ["4:3", null, "16:9"][aspectRatio+1] + "<br>Mission #" + currentMission;
	
	for (let i = 0; i < colorCounts.length; i++) {
		permutationCount *= colorCounts[i];
	}
	permutationCount *= maxLayout - minLayout + 1;
	permutations.innerHTML = "Possible permutations: <b>" + permutationCount + "</b>";
}

var contentLookup = function() {
	let color = parseInt(document.getElementById("lookupOptions").value);

	for (let mission = 1; mission <= 100; mission++) {
		let match = 0;
		let outcomes = ["#9c9c9c", "#e6c807", "#37db63"];

		for (let i = 422 + (22 * (mission - 1)) + 1; i < 422 + (22 * (mission - 1)) + 9; i++) {
			if (param[i] < 10) {
				if (param[i] == color) {
					match = 2;
					break;
				}
			} else {
				let min = parseInt(param[i].toString().charAt(0));
				let max = parseInt(param[i].toString().charAt(1));
				
				if (color >= min && color <= max) {
					match = 1;
				}
			}
		}

		let currentCell = document.getElementById((mission - 1) + "c");
		currentCell.style.backgroundColor = outcomes[match];
		currentCell.className = "clSquare type" + match;
	}
}

var changeMission = function() {
	minLayout = param[422 + (22 * (currentMission - 1)) + 17];
	maxLayout = param[422 + (22 * (currentMission - 1)) + 18];
	selectedLayout = minLayout;
	hexString = [layouts0, null, layouts1][aspectRatio+1][selectedLayout];
	drawBoard(true);
}

var swapAspectRatio = function() {
	aspectRatio *= -1;
	hexString = [layouts0, null, layouts1][aspectRatio+1][selectedLayout];
	drawBoard(false);
}

var addMission = function() {
	if (currentMission < 100) {
		currentMission += 1;
		changeMission();
	}
}

var subtractMission = function() {
	if (currentMission > 1) {
		currentMission -= 1;
		changeMission();
	}
}

var jumpToMission = function() {
	let allegedInput = parseInt(missionInput.value);

	if (allegedInput >= 1 && allegedInput <= 100) {
		currentMission = allegedInput;
		changeMission();
	}
}

var changeLayout = function(event) {
	document.getElementById(selectedLayout.toString() + "a").classList.remove("selected");
	document.getElementById(event.currentTarget.id).classList.add("selected");
	selectedLayout = parseInt(event.currentTarget.id.slice(0, event.currentTarget.id.length));
	hexString = [layouts0, null, layouts1][aspectRatio+1][selectedLayout];
	drawBoard(false);
}

/* There is a 100% better way to do this and it is literally in this same program.
I forgot the .classList property existed.
Woe is me. */

var clColorHover = function() {
	switch(event.currentTarget.className.substring(9, 14)) {
		case "type1":;
			event.currentTarget.style.backgroundColor = "#f5e476";
			break;

		case "type2":
			event.currentTarget.style.backgroundColor = "#9cf0b2";
			break;
	}
}

var clColorOut = function() {
	switch(event.currentTarget.className.substring(9, 14)) {
		case "type1":
			event.currentTarget.style.backgroundColor = "#e6c807";
			break;

		case "type2":
			event.currentTarget.style.backgroundColor = "#37db63";
			break;
	}
}

var clColorClick = function() {
	console.log(event.currentTarget.className);
	if (event.currentTarget.className.substring(9, 14) != "type0" && event.currentTarget.className != "clSquare") {
		missionInput.value = parseInt(event.currentTarget.id.substring(0, event.currentTarget.id.length)) + 1;
		jumpToMission();
	}
}

swapButton.addEventListener("click", swapAspectRatio);
previousMissionButton.addEventListener("click", subtractMission);
nextMissionButton.addEventListener("click", addMission);
jumpButton.addEventListener("click", jumpToMission);
searchButton.addEventListener("click", contentLookup);
window.addEventListener("load", clTable);

drawBoard(true);


