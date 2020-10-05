var game = null;
var whichTeamTurn = null;
var maxMiss = 3;
var missPointTeam1 = 0;
var missPointTeam2 = 0;
var currentQ = 0;

	function start_game(){	
		// play_sound('ff_open.mp3');
		document.getElementById("buttonStart").disabled = true;
			
		var counter = 0;
		var interval = setInterval(function() {
			counter--;
			if (counter < 3) {
				game.document.getElementById("welcomePageInfo").style.display = "none";	
			}
			if (counter < 0) {
				clearInterval(interval);
				game.document.getElementById("counter").innerHTML = "Pradžia";
				game.document.getElementById("counter").style.display = "none";	
				game.document.body.setAttribute("style", "background: linear-gradient(to bottom, #a7cfdf -50%, #580e12 100%);");
				game.app.init();
				
			}
		}, 500);	
		
		
	}
	
	function finish_game(){
		game.document.getElementById("welcomePageInfo").innerHTML = "Pabaiga";
		game.document.getElementById("welcomePageInfo").style.display = "";
	}
	
	function open_game_window() {
		game = window.open('game.html', 'game', 'resizable=yes');
		document.getElementById("buttonStart").disabled = false;
		document.getElementById("buttonOpen").disabled = true;
		document.getElementById("buttonClose").disabled = false;	
	}
	
	function close_game_window() {
		game.close();
	}
		
	function game_window_init_done() {
		document.getElementById("question").className = "label label-success";
		document.getElementById("buttonStart").disabled = true;
		document.getElementById("buttonAwardT1").disabled = false;
		document.getElementById("buttonAwardT2").disabled = false;
		document.getElementById("buttonAwardT3").disabled = false;
		
	}
	
	function game_window_closed() {
		game = null;
	}
	
	// play sound object
	var audio = new Audio('');
	function play_sound(sound) {
		audio = new Audio('sfx/'+sound);
		audio.play();
	}
	
	function pause_sound() {
		audio.pause();
	}
	
	function printMissPoint(){
		for (i = 0; i < missPointTeam1; i++) { 
			game.document.getElementById("missTeam1_"+ (i+1)).style.visibility = "visible";
		}
		for (i = 0; i < missPointTeam2; i++) { 
			game.document.getElementById("missTeam2_"+ (i+1)).style.visibility = "visible";
		}
	}
	
	function deleteMissPoint(){
		missPointTeam1 = 0;
		missPointTeam2 = 0;
	}
	
	function showMissPoint(team){
		if (team == "1"){
			if (missPointTeam1 < maxMiss) missPointTeam1++;
			document.getElementById("misspoint1").innerHTML = missPointTeam1;
		}
		else if (team == "2") {
			if (missPointTeam2 < maxMiss) missPointTeam2++;
			document.getElementById("misspoint2").innerHTML = missPointTeam2;
		}	
		play_sound('ff-strike.wav');
	}
	
	function nextQuestion(){
		var table = document.getElementById("tableAnswers");
		for(var i = table.rows.length - 1; i > 0; i--)
		{
			table.deleteRow(i);
		}
		deleteMissPoint();
		cleanTeams();
		game.app.changeQuestion();
		
	}
	
	function calculatePoints(team){
		if (team == "1"){
			game.document.getElementById("awardTeam1points").click();
		}
		else if (team == "2"){
			game.document.getElementById("awardTeam2points").click();
		}
		
	play_sound('ff_dogru.mp3');
	}
	
	function GetQuestion(questionParam){
		document.getElementById("question").innerHTML = questionParam;
	}
	
	function GetAnswers(answers, currentQnumber, totalQnumber){
		
		var table = document.getElementById("tableAnswers");
		for (i = 0; i < answers.length; i++) { 
			var row = table.insertRow(i+1);
			var cell1 = row.insertCell(0)
			var cell2 = row.insertCell(1)
			var cell3 = row.insertCell(2)
			
			var tempID = "answer_" + i;
			
			row.setAttribute("id", tempID, 0);
			row.onclick = function() { 
				game.document.getElementById(this.id).click();
				var tempBgColor = this.style.backgroundColor;
				if(tempBgColor == ""){
					this.setAttribute("style", "background-color: lightgreen;");
					play_sound('ff-clang.wav');
				}
				else if(tempBgColor == "lightgreen"){
					this.setAttribute("style", "background-color: ;");
				}
			}  
			cell1.innerHTML = i;
			cell2.innerHTML = answers[i][0];
			cell3.innerHTML = answers[i][1];
			
			document.getElementById("tableAnswers").style.display = "";
			document.getElementById("answerInfo").style.display = "none";
			
			document.getElementById("totalQ").innerHTML = totalQnumber;
			document.getElementById("currentQ").innerHTML = currentQnumber;
		}
		
		
	}
	
	function cleanTeams() {
		game.document.getElementById("team1").style.border = "";
		game.document.getElementById("awardTeam1").style.border = "";
		game.document.getElementById("team2").style.border = "";
		game.document.getElementById("awardTeam2").style.border = "";
		document.getElementById("buttonMistakeT2").disabled = false;
		document.getElementById("buttonMistakeT1").disabled = false;
	}

	function turnOfTeam(team){
		whichTeamTurn = team;
		if (team == "team1"){
			game.document.getElementById("team1").style.border = "15px solid cornsilk";
			game.document.getElementById("awardTeam1").style.border = "15px solid cornsilk";
			game.document.getElementById("team2").style.border = "";
			game.document.getElementById("awardTeam2").style.border = "";

			document.getElementById("buttonMistakeT1").disabled = false;

			document.getElementById("buttonMistakeT2").disabled = true;
		}
		else if (team == "team2"){
			game.document.getElementById("team2").style.border = "15px solid cornsilk";
			game.document.getElementById("awardTeam2").style.border = "15px solid cornsilk";
			game.document.getElementById("team1").style.border = "";
			game.document.getElementById("awardTeam1").style.border = "";

			document.getElementById("buttonMistakeT2").disabled = false;
			
			document.getElementById("buttonMistakeT1").disabled = true;

		}
	}
	
	function gameClosed(){
		//sıfırlayacaksın abi herşeyi!!!
		game = null;
		document.getElementById("question").innerHTML = "The game has been finished.";
		document.getElementById("question").className = "label label-danger";
		missPointTeam1 = 0;
			document.getElementById("misspoint1").innerHTML = missPointTeam1;
		missPointTeam1 = 0;
			document.getElementById("misspoint2").innerHTML = missPointTeam1;
			
		document.getElementById("buttonClose").disabled = true;
		document.getElementById("buttonMistakeT1").disabled = true;
		document.getElementById("buttonMistakeT2").disabled = true;
		document.getElementById("buttonAwardT1").disabled = true;
		document.getElementById("buttonAwardT2").disabled = true;
		document.getElementById("buttonAwardT3").disabled = true;
		document.getElementById("buttonStart").disabled = true;
		document.getElementById("buttonOpen").disabled = false;
		document.getElementById("tableAnswers").style.display = "none";
		document.getElementById("answerInfo").style.display = "";

		var table = document.getElementById("tableAnswers");
		for(var i = table.rows.length - 1; i > 0; i--)
		{
			table.deleteRow(i);
		}
	}
	
	function gameCompleted(){
		var x = game.document.getElementById('firework');
		document.getElementById("buttonWinner").disabled = false;
		if (x.style.visibility === 'hidden') {
			x.style.visibility = 'visible';
			game.document.getElementById("gameBoardId").style.display = "none";
		} else {
			x.style.visibility = 'hidden';
		}
		
		
		var table = document.getElementById("tableAnswers");
		for(var i = table.rows.length - 1; i > 0; i--){
			table.deleteRow(i);
		}
		announceWinner();
	}
	
	function hideFirework(){		
		game.document.getElementById('firework').style.visibility = 'hidden';
	}
	
	function announceWinner(){
		game.document.getElementById("winnerId").innerHTML = game.winner();
		game.document.getElementById('winnerId').style.display = "block";
	}
	
	function changeTeamNames(){
		game.teamNameChange();
	}
	
	function changeTeamPoint(){
		game.teamPointChange();
		document.getElementById("team1POINT").textContent = game.document.getElementById("team1").value;
		document.getElementById("team2POINT").textContent = game.document.getElementById("team2").value;
	}
	
	function changeTurn(){
		if(whichTeamTurn == "team1"){
			turnOfTeam("team2");
		}
		else if (whichTeamTurn == "team2"){
			turnOfTeam("team1");
		}
	}