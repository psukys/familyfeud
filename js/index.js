var team1 = window.opener.document.getElementById("team1NAME").value;
var team2 = window.opener.document.getElementById("team2NAME").value;

var app = {
  version: 1,
  currentQ: 0,
  jsonFile:"js/klausimai.json",
  board: $("<div id='gameBoardId' class='gameBoard'>"+
             "<!--- Scores --->"+
             "<div class='scoreHolder'>" +
                "<div class='score' id='boardScore'>0</div>"+
                "<div id='awardTeam1'><span id='team1name'>team1</span><div class='score' id='team1' >0</div></div>"+
                "<div id='awardTeam2'><span id='team2name'>team2</span><div class='score' id='team2' >0</div></div>"+
              "</div>" +

             "<!--- Question --->"+
             "<div id='questionBar' class='questionHolder'>"+
               "<span class='question'></span>"+
             "</div>"+
           
             "<!--- Answers --->"+
             "<div id='answerBar' class='colHolder'>"+
               "<div class='col1'></div>"+
               "<div class='col2'></div>"+
             "</div>"+
           
             "<!--- Buttons --->"+
             "<div id='buttonBar' class='btnHolder'>"+
			   "<div id='missTeam1_3' class= 'miss'>X</div>"+
			   "<div id='missTeam1_2' class= 'miss'>X</div>"+
			   "<div id='missTeam1_1' class= 'miss'>X</div>"+
               "<div id='awardTeam1points' data-team='1' class='button'>" + team1 + "</div>"+
               "<div id='awardTeam2points' data-team='2'class='button'>" + team2 + "</div>"+
			   "<div id='missTeam2_1' class= 'miss'>X</div>"+
			   "<div id='missTeam2_2' class= 'miss'>X</div>"+
			   "<div id='missTeam2_3' class= 'miss'>X</div>"+
             "</div>"+
           "</div>"
		   ),

	
  // Utility functions
  shuffle: function(array){
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },
  jsonLoaded: function(data){
    //console.clear()
    app.allData   = data
    app.questions = Object.keys(data)
    app.makeQuestion(app.currentQ)
    $('body').append(app.board)
  },
  // Action functions
  makeQuestion: function(qNum){
    var qText  = app.questions[qNum]
    var qAnswr = app.allData[qText]
		
    var qNum = qAnswr.length
        qNum = (qNum<8)? 8: qNum;
        qNum = (qNum % 2 != 0) ? qNum+1: qNum;
    
    var boardScore = app.board.find("#boardScore")
    var question   = app.board.find(".question")
    var col1       = app.board.find(".col1")
    var col2       = app.board.find(".col2")
    
    boardScore.html(0)
    question.html(qText.replace(/&x22;/gi,'"'))
    col1.empty()
    col2.empty()

    for (var i = 0; i < qNum; i++){
      var aLI     
      if(qAnswr[i]){
        aLI = $("<div class='cardHolder' data-card-got='false' id='answer_" + i + "'>"+
                  "<div class='card'>"+
                    "<div class='front'>"+
                      "<span class='DBG'>"+(i+1)+"</span>"+
                    "</div>"+
                    "<div class='back DBG'>"+
                      "<span>"+qAnswr[i][0]+"</span>"+
                      "<b class='LBG'>"+qAnswr[i][1]+"</b>"+
                    "</div>"+
                  "</div>"+
                "</div>")
      } else {
        aLI = $("<div class='cardHolder empty'><div></div></div>")
      }
      var parentDiv = (i<(qNum/2))? col1: col2;
      $(aLI).appendTo(parentDiv)
    }  
    
    var cardHolders = app.board.find('.cardHolder')
    var cards       = app.board.find('.card')
    var backs       = app.board.find('.back')
    var cardSides   = app.board.find('.card>div')

    TweenLite.set(cardHolders , {perspective:800});
    TweenLite.set(cards       , {transformStyle:"preserve-3d"});
    TweenLite.set(backs       , {rotationX:180});
    TweenLite.set(cardSides   , {backfaceVisibility:"hidden"});

    cards.data("flipped", false)
    cards.data("gotPoint", false)
	
    function showCard(){
      var card = $('.card', this)
      var flipped = $(card).data("flipped")	  
      var cardRotate = (flipped)?0:-180;
      TweenLite.to(card, 1, {rotationX:cardRotate, ease:Back.easeOut})
      flipped = !flipped
      $(card).data("flipped", flipped)
	  
	  app.getBoardScore(this.id)
    }
	window.opener.GetQuestion(qText);
	window.opener.GetAnswers(qAnswr, app.currentQ+1, app.questions.length);
    cardHolders.on('click',showCard)
  },
  getBoardScore: function(card){
	
	//var gotPointsBefore = document.getElementById(card).getAttribute("data-card-got");
	
    var cards = app.board.find('.card')
    var boardScore = app.board.find('#boardScore')
    var currentScore = {var: boardScore.html()}
    var score = 0
    function tallyScore(){
      if($(this).data("flipped")){
		var value = $(this).find("b").html()
		score += parseInt(value)
	}
    }
    $.each(cards, tallyScore)      
    TweenMax.to(currentScore, 1, {
      var: score, 
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
	
	//document.getElementById(card).setAttribute("data-card-got", "true"); 
	
  },

  awardPoints: function(num){
    var num          = $(this).attr("data-team")
    var boardScore   = app.board.find('#boardScore')
    var currentScore = {var: parseInt(boardScore.html())}
    var team         = app.board.find("#team"+num)
	
    var teamScore    = {var: parseInt(team.html())}
    var teamScoreUpdated = (teamScore.var + currentScore.var)
	
	
    TweenMax.to(teamScore, 1, {
      var: teamScoreUpdated, 
      onUpdate: function () {
        team.html(Math.round(teamScore.var));
		window.opener.document.getElementById("team1POINT").value = document.getElementById("team1").innerHTML;
		window.opener.document.getElementById("team2POINT").value = document.getElementById("team2").innerHTML;
      },
      ease: Power3.easeOut,
    });
    
    TweenMax.to(currentScore, 1, {
      var: 0, 
      onUpdate: function () {
        boardScore.html(Math.round(currentScore.var));
      },
      ease: Power3.easeOut,
    });
	
	
  },
  changeQuestion: function(){
    app.currentQ++
    app.makeQuestion(app.currentQ)
	window.opener.GetAnswers(qAnswr, app.currentQ, currentQ);
  },
  // Inital function
  init: function(){
    $.getJSON(app.jsonFile, app.jsonLoaded)
    app.board.find('#newQuestion' ).on('click', app.changeQuestion)
    app.board.find('#awardTeam1points'  ).on('click', app.awardPoints)
    app.board.find('#awardTeam2points'  ).on('click', app.awardPoints)
	  window.opener.game_window_init_done();

  }  
}
	function teamPointChange(){		
		document.getElementById("team1").innerHTML = window.opener.document.getElementById("team1POINT").value;
		document.getElementById("team2").innerHTML = window.opener.document.getElementById("team2POINT").value;
	}

	function teamNameChange(){
		team1 = window.opener.document.getElementById("team1NAME").value;
		team2 = window.opener.document.getElementById("team2NAME").value;
		
		document.getElementById("team1name").innerHTML = team1;
		document.getElementById("team2name").innerHTML = team2;
	}

	function winner(){
		var winner;
		var team1Score = document.getElementById("team1").innerHTML;
		var team2Score = document.getElementById("team2").innerHTML;
		
		if(team1Score>team2Score){
			winner = "Laimėtojai " + team1 + "!";
		}
		else if(team1Score<team2Score){
			winner = "Laimėtojai " + team2 + "!";
		}
		else{
			winner = "Lygiosios!";
		}
		return winner;
	}
//app.init()
window.onload  = function (e) {
		window.opener.hideFirework();
};
//oyun kapatıldı.
window.onbeforeunload = function (e) {
		// notify control window
		window.opener.gameClosed();
};
//http://www.qwizx.com/gssfx/usa/ff.htm