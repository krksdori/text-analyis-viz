// var eArticle = getHtmlContent("wikiText");
//
import $ from 'jquery';
import './style.css';
import articles from './articles';




$("#article-page-container").hide();
$("#menu-wrapper").show();



for (var i = 0; i < articles.length; i++) {
	$("#menu").append("<a id='link"+articles[i].title+"' href='#'>"+articles[i].title+"</a><br>");
	menuClickExecute(articles[i].title, i);
}

$( "#back-button" ).click(function() {
	$(".reset").empty();
	$("#article-page-container").hide();
	$("#menu-wrapper").show();
});

var eArticle;
var wArticle;
var eConn;
var wConn;
var currentTitle;

let numConn = 10;
let encyConnIndex = [];
let wikiConnIndex = [];

for (var i = 0; i < numConn; i++) {
	encyConnIndex[i]=[];
	wikiConnIndex[i]=[];
}

function menuClickExecute(link, index){
	$( "#link"+link ).click(function() {
		$("#article-page-container").show();
		$("#menu-wrapper").hide();

		eArticle = articles[index].eArt;
		wArticle = articles[index].wArt;
		eConn = articles[index].eConn;
		wConn = articles[index].wConn;
		currentTitle = articles[index].title;

		var wYear = articles[index].wYear;
		var eYear = articles[index].eYear;

		console.log(wYear);
		console.log(eYear);

		appendArt(eArticle,eConn,"encyText","encyLog","ency");
		appendArt(wArticle,wConn,"wikiText","wikiLog","wiki");

		mainF(eArticle,eConn,"#encyText","#encyLog","ency");
		mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");
		canvasLines();

		// $("#menu-wrapper").addClass("hidden");
	
		// $("#wrap").removeClass("hidden");
		// $("#header").removeClass("hidden");

		var $encyTitleDiv = $('<div>').addClass("ency-header-title header-title reset").text("Encyclopedia – " + currentTitle);
		var $wikiTitleDiv = $('<div>').addClass("wiki-header-title header-title reset").text("Wikipedia – " + currentTitle);

		var $wYearDiv = $('<div>').addClass("wikiYear artYear header-title reset").text(wYear);
		var $eYearDiv = $('<div>').addClass("encyYear artYear header-title reset").text(eYear);

    	$('#header').append($encyTitleDiv);
    	$('#header').append($wikiTitleDiv);
    	$('#header').append($wYearDiv);
    	$('#header').append($eYearDiv);

	});
}



function mainF(art,conn,textDest,logDest, wikiOrEncy){
	let lowerCaseArt = art.toLowerCase();
	let splArt = lowerCaseArt.split(".");
	let wordArray = [];
	let count = [];
	let wordCount = 0;

	for (var i = 0; i < numConn; i++) {
		count.push(0);
	}

	for (let i = 0; i < splArt.length; i++) {
		wordArray.push(splArt[i].split(" "));
	}

	function findConn(index,searchNo,search1,search2){
		let indof0 = wordArray[index].indexOf(search1);
		let indof1 = wordArray[index].indexOf(search2);

		if(indof0 !== -1 && indof1 !== -1){
			$("#"+wikiOrEncy+index+"_"+indof0).addClass(wikiOrEncy+"hl"+searchNo);
			$("#"+wikiOrEncy+index+"_"+indof1).addClass(wikiOrEncy+"hl"+searchNo);

			count[searchNo] += 1;

			if (wikiOrEncy == "ency") {
				encyConnIndex[searchNo].push(index+"_"+indof0);
				encyConnIndex[searchNo].push(index+"_"+indof1);
				// console.log(searchNo+" /ency/ "+encyConnIndex[searchNo]);
			} else {
				wikiConnIndex[searchNo].push(index+"_"+indof0);
				wikiConnIndex[searchNo].push(index+"_"+indof1);
				// console.log(searchNo+" /wiki/ "+wikiConnIndex[searchNo]);
			}	
		}


		
	}
	
	// $(logDest).empty();

	for (let j = 0; j < numConn; j++) {
		for (let i = 0; i < wordArray.length; i++) {
			findConn(i,j,conn[j*2],conn[(j*2)+1]);
		}
		$("#"+wikiOrEncy+"ConnCount"+j).text(`${count[j]}`);
	}

	for (var i = 0; i < wordArray.length; i++) {
		wordCount += wordArray[i].length;
	}

	// $(logDest).append(`<br>Word count: ${wordCount} will fix word count soon...`);
}


function appendArt(art,conn,div,logDiv,wikiOrEncy){
	var article = art;
	var sentences = article.split(".");

	for (var i = 0; i < sentences.length; i++) {
	  sentences[i] = sentences[i] + ".";
	}

	let wordArray = [];

	for (let i = 0; i < sentences.length; i++) {
	   wordArray.push(sentences[i].split(" "));
	 }

	var count = 0;
	for (var i = 0; i < wordArray.length; i++) {
		count += wordArray[i].length;
	}

	//append connection log
	for (var i = 0; i < 10; i++) {
		$("#"+logDiv).append(`<span id='${wikiOrEncy}ConnCount${i}'></span>&nbsp;<span class='${wikiOrEncy}hl${i}'>${conn[i*2]} - ${conn[(i*2)+1]} </span><br>`);
	}
	

	$("#"+div).empty();
 
 	// old append without animation
	// for (let j = 0; j < wordArray.length; j++) {
	// 	for (let i = 0; i < wordArray[j].length; i++) {
	//     	$("#"+div).append(`<span id='${wikiOrEncy}${j}_${i}'>${wordArray[j][i]}</span> `);
	// 	}
	// }

	var time = 0;
	var index = 0;

	function animateText(){
		time = 0;
		var timer = setInterval(function(){
			if (index <= wordArray.length-1){
				if (time <= wordArray[index].length-1) {
					$("#"+div).append(`<span id='${wikiOrEncy}${index}_${time}'>${wordArray[index][time]}</span> `);
					time++;
				} else {
					index+=1;
					animateText();
				}
			} else {
				clearInterval(timer);
				mainF(eArticle,eConn,"#encyText","#encyLog","ency");
				mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");
			}
		}, 20);
	}
	animateText();
}


$(".text").scroll(function() {	
    var y = $(this).scrollTop();
    var $header = $("#header");
    var articlesHolderHeight = $(".text").height();
    if (y >= 1) {
        $header.addClass('shadow');
    } else {
        $header.removeClass('shadow'); 
    }
});


// import './canvas.js';





function canvasLines() {
	// console.log(searchNo+" /ency/ "+encyConnIndex[searchNo]);
	console.log(encyConnIndex[1]);
    var canvas = document.getElementById('canvas'),
    	ctx = canvas.getContext('2d');

    // resize the canvas to fill browser window dynamically
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            drawStuff(); 
    }

    resizeCanvas();

        // console.log(numConn+"kk");

    function drawStuff() {
    	// console.log(getPos("#ency1_5"));
    	
    	var hoverSwitches = [];
    	for (var i = 0; i < numConn; i++) {
    		hoverSwitches[i] = false;
    	}


    	
		$("#wrap").mousemove(function( event ) {
			displayLines(0, "red", "ency");
			// displayLines(1,"red", "ency");
			displayLines(2,"blue", "ency");

			// displayLines(0,"cyan", "wiki");
			// displayLines(1,"lime", "ency");
			// displayLines(2,"blue", "ency");


			
			// displayLines("#ency9_1","#ency1_38","blue");

			function displayLines(index, color, encyOrWiki){
				var activeConnIndex;

				if (encyOrWiki == "ency") {
					activeConnIndex = encyConnIndex;

				} else {
					activeConnIndex = wikiConnIndex;
				}




				$("."+encyOrWiki+"hl"+index).mouseenter(function() {
					hoverSwitches[index] = true;
					// console.log("s");
				});
				$("."+encyOrWiki+"hl"+index).mouseleave(function() {
					hoverSwitches[index] = false;
				});


					// console.log(encyConnIndex);

				var comp = 56;
				if (hoverSwitches[index] == true) {
					var positions1=[];
					var positions2=[];

					ctx.clearRect(0, 0, canvas.width, canvas.height);

					function getPosDrawLine(index,span1,span2){
						positions1[index] = $("#"+encyOrWiki+span1).position();
						positions2[index] = $("#"+encyOrWiki+span2).position();

						ctx.strokeStyle = color;
						ctx.lineWidth=1;
						ctx.beginPath();
						ctx.moveTo(positions1[index].left+comp,positions1[index].top+comp);
						ctx.lineTo(positions2[index].left+comp,positions2[index].top+comp);
						ctx.closePath();
						ctx.stroke();

					}


					for (var i = 0; i < (activeConnIndex[index].length)/2; i++) {
						getPosDrawLine(i,activeConnIndex[index][i*2],activeConnIndex[index][i*2+1]);
					}

					
				} else {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
		});


    }
}
