// var eArticle = getHtmlContent("wikiText");
//
import $ from 'jquery';
import './style.css';
import articles from './articles';


///////Refresh if 3 min inactive
var idleTime = 0;

$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute

    //Zero the idle timer on mouse movement.
    $(this).mousemove(function (e) {
        idleTime = 0;
    });
    $(this).keypress(function (e) {
        idleTime = 0;
    });

    var possibleLetters = ["A", "a", "B", "b", "C","c", "D", "d", "E", "e", "F", "f", "G", "g", "H", "h", "I", "i", "J", "j", "K", "k", "L", "l", "M", "m", "N", "n", "O", "o", "P", "p", "Q", "q", "R", "r", "S", "s", "T", "t", "U", "u", "V", "v", "W", "w", "X", "x", "Y", "y", "Z", "z", "0","1","2","3","4","5","6","7","8","9","0"];

	var changingArray = ["C", "h", "a", "n", "g", "i", "n", "g", " ", "P", "a", "r", "a", "d", "i", "g", "m", "s"];

	var intervalCounter;

	init();

	setTimeout(function() {
		animate();
		animateStop();
	}, 0);

	function init() {

		$("#start-page-animation").removeClass("hide").addClass("show");
		$("#title").removeClass("hide").addClass("show");

		changingArray.forEach(function(letter, i){
			var randomLetter = possibleLetters[parseInt(Math.random()*possibleLetters.length)];
			var $wordChanging = $('<span>').addClass('letter').text(randomLetter).attr("data-index", i);
    		$("#title").append($wordChanging);
    	});
	}

	function animate() {
		setInterval(function() {
			changingArray.forEach(function(letter, i){
				var obj = $( ".letter[data-index='"+i+"']" );
				if(obj.hasClass("done") == false) {
					var randomLetter = possibleLetters[parseInt(Math.random()*possibleLetters.length)];
					obj.text(randomLetter);
				}
    		});

			// check if animation is over
			var countDone = 0;
			changingArray.forEach(function(letter, i){
				if($( ".letter[data-index='"+i+"']" ).hasClass("done")) {
					countDone++;
				}
				if(countDone == changingArray.length) {
					clearInterval(intervalCounter);
					setTimeout(function() {
							$("#start-page-animation").removeClass("show").addClass("hide");
							$("#title").removeClass("show").addClass("hide");
					}, 2000);
				}
			});

		}, 100);
	}

	function animateStop() {
		intervalCounter = setInterval(function() {
			changingArray.forEach(function(letter, i){
				if(Math.random() > 0.5) {
					$( ".letter[data-index='"+i+"']" ).addClass("done").text(letter);	
				}
    		});
		}, 200);
	}
});

function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime >= 3) { // 3 mins
        window.location.reload();
    }
}
////////////



$("#article-page-container").hide();
$("#menu-wrapper").show();



//////////////MENU
var abc = [];

for (var i = 0; i < articles.length; i++) {
	abc.push(articles[i].title.charAt(0));
}

var uniqueAbc = [];
$.each(abc, function(i, el){
    if($.inArray(el, uniqueAbc) === -1) uniqueAbc.push(el);
});

for (var i = 0; i < uniqueAbc.length; i++) {
	$("#menu").append(`
		<div id="menuLetter_${uniqueAbc[i]}" class="menuLetter">
			${uniqueAbc[i]}<hr>
		</div>`
	);
}

for (var i = 0; i < articles.length; i++) {
	for (var j = 0; j < uniqueAbc.length; j++) {
		if (articles[i].title.charAt(0) == uniqueAbc[j]) {
			$(`#menuLetter_${uniqueAbc[j]}`).append(`<a id='link${articles[i].title}' href='#'>${articles[i].title}</a><hr>`);
		}
	}
	menuClickExecute(articles[i].title, i);
}
///////////////////////


$( "#back-button" ).click(function() {
	$(".reset").empty();
	$("#article-page-container").hide();
	$("#menu-wrapper").show();
});


$( "#about-button" ).click(function() {
	$("#about-page-wrap").removeClass("hidden");
	$("#canvas-info").removeClass("hidden");
	// infoLines();
	
});

$('#x-button').click(function() {
	$("#about-page-wrap").addClass("hidden");
	$("#canvas-info").addClass("hidden");
});



function showURL(div, div2){
	$(div).click(function() {
	    var $target = $(div2),
	        $toggle = $(this);
	    var pos = $(this).position();

	     $(div2).css({
	        position: "absolute",
	        top: (pos.top - 50) + "px",
	         left: pos.left  + "px"
	    });

	    $target.slideToggle( 300, function () {});
	});
}

showURL("#daniel", "#daniel-div");
showURL("#dora", "#dora-div");
showURL("#kai", "#kai-div");
showURL("#susana", "#susana-div");



var eArticle;
var wArticle;
var eConn;
var wConn;
var currentTitle;
var activeHover = null;

let numConn = 10;
let encyConnIndex = [];
let wikiConnIndex = [];




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
		var tab = "&nbsp;&nbsp;&nbsp;&nbsp;";

		appendArt(eArticle,eConn,"encyText","encyLog","ency", index);
		appendArt(wArticle,wConn,"wikiText","wikiLog","wiki", index);

		mainF(eArticle,eConn,"#encyText","#encyLog","ency");
		mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");
		canvasLines();

		var $encyTitleDiv = $('<div>').addClass("ency-header-title header-title reset").html(`Encyclopédie – ${currentTitle}${tab}${eYear}`);
		var $wikiTitleDiv = $('<div>').addClass("wiki-header-title header-title reset").html(`Wikipedia – ${currentTitle}${tab}${wYear}`);

    	$('#header').append($encyTitleDiv);
    	$('#header').append($wikiTitleDiv);
	});
}

function mainF(art,conn,textDest,logDest, wikiOrEncy){
	if (wikiOrEncy == "ency") {
		for (var i = 0; i < numConn; i++) {
			encyConnIndex[i]=[];
		}
	} else {
		for (var i = 0; i < numConn; i++) {
			wikiConnIndex[i]=[];
		}
	}

	let lowerCaseArt = art.toLowerCase();

	function regex (str) {
	    return str.replace(/(~|`|!|@|#|$|%|^|&|\*|\(|\)|{|}|\[|\]|;|:|\"|<|,|>|\?|\/|\\|_|\+|=)/g,"");
	}

	let filterPunct = regex(lowerCaseArt);

	let splArt = filterPunct.split(".");
	
	let wordArray = [];
	let count = [];
	let wordCount = 0;
	let connectedPerSntc = [];

	for (var i = 0; i < numConn; i++) {
		connectedPerSntc.push(new Array());
	}

	for (var i = 0; i < numConn; i++) {
		count.push(0);
	}

	for (let i = 0; i < splArt.length; i++) {
		wordArray.push(splArt[i].split(" "));
	}

	function indexAll(array, match){
	    return array.reduce(function(inds,val,i){
	        if(val == match) inds.push(i);
	        return inds;
	    },[]);
	}

	function improvedFindConn(sentenceIndex, searchNo, search1, search2){
		let incr = 0;
		let indof0 = indexAll(wordArray[sentenceIndex],conn[search1]);
		let indof1 = indexAll(wordArray[sentenceIndex],conn[search2]);

		if (indof0.length !== 0 && indof1.length !== 0){
			connectedPerSntc[searchNo].push(0);

			for (var i = 0; i < indof0.length; i++) {
				connectedPerSntc[searchNo][count[searchNo]]+=1;
				// incr +=1;

				$("#"+wikiOrEncy+sentenceIndex+"_"+indof0[i]).addClass("hl " + wikiOrEncy+"hl"+searchNo);
				if (wikiOrEncy == "ency") {
					encyConnIndex[searchNo].push(sentenceIndex+"_"+indof0[i]);
				} else {
					wikiConnIndex[searchNo].push(sentenceIndex+"_"+indof0[i]);
				}
				// connectedPerSntc[searchNo][sentenceIndex].push("1");
			}

			for (var i = 0; i < indof1.length; i++) {
				connectedPerSntc[searchNo][count[searchNo]]+=1;
				// incr +=1;

			 	$("#"+wikiOrEncy+sentenceIndex+"_"+indof1[i]).addClass("hl " + wikiOrEncy+"hl"+searchNo);
			 	if (wikiOrEncy == "ency") {
					encyConnIndex[searchNo].push(sentenceIndex+"_"+indof1[i]);
				} else {
					wikiConnIndex[searchNo].push(sentenceIndex+"_"+indof1[i]);
				}
				// connectedPerSntc[0][sentenceIndex]=1;
				// console.log("count "+connectedPerSntc[0])
			}
			count[searchNo] += 1;
		}
	}

	for (var j = numConn-1; j >= 0; j--) {
		for (var i = 0; i < wordArray.length; i++) {
			// improvedFindConn(i,j,j*2,j*2+1);
		}
	}	

	// console.log(connectedPerSntc);

	function findConn(index,searchNo,search1,search2){
		let indof0 = wordArray[index].indexOf(search1);
		let indof1 = wordArray[index].indexOf(search2);


		if(indof0 !== -1 && indof1 !== -1){
			$("#"+wikiOrEncy+index+"_"+indof0).addClass("hl " + wikiOrEncy+"hl"+searchNo);
			$("#"+wikiOrEncy+index+"_"+indof1).addClass("hl " + wikiOrEncy+"hl"+searchNo);

			count[searchNo] += 1;

			if (wikiOrEncy == "ency") {
				encyConnIndex[searchNo].push(index+"_"+indof0);
				encyConnIndex[searchNo].push(index+"_"+indof1);
			} else {
				wikiConnIndex[searchNo].push(index+"_"+indof0);
				wikiConnIndex[searchNo].push(index+"_"+indof1);
			}	
		}
	}


	for (let j = 0; j < numConn; j++) {
		for (let i = 0; i < wordArray.length; i++) {
			findConn(i,j,conn[j*2],conn[(j*2)+1]);
		}
		$("#"+wikiOrEncy+"ConnCount"+j).text(`${pad(count[j])}`);
	}
	

	for (var i = 0; i < wordArray.length; i++) {
		wordCount += wordArray[i].length;
	}

	$("#wordCount"+wikiOrEncy).text(`Word count: ${wordCount}`);

	// console.log("wtf");

	var percArray = getPercentage(count);
	


	for (let i = 0; i < numConn; i++) {
		$("#"+wikiOrEncy+"Perc"+i).text(`${pad(percArray[i])}%`);
	}
}

function appendArt(art,conn,div,logDiv,wikiOrEncy, index){
	var article = art;
	var sentences = article.split(".");

	for (var i = 0; i < sentences.length; i++) {
	  sentences[i] = sentences[i] + ".";
	}

	let wordArray = [];

	for (let i = 0; i < sentences.length-1; i++) {
	   wordArray.push(sentences[i].split(" "));
	 }

	var count = 0;
	for (var i = 0; i < wordArray.length; i++) {
		count += wordArray[i].length;
	}

	//append connection log
	for (var i = 0; i < 10; i++) {
		$("#"+logDiv).append(`
			<span id='${wikiOrEncy}Perc${i}'>00%</span>&nbsp;
			<span id='${wikiOrEncy}ConnCount${i}'>00</span>&nbsp;
			<span class='logcon hl ${wikiOrEncy}hl${i}'>
				${conn[i*2]} - ${conn[(i*2)+1]}
			</span><br>`);
	}

	$("#"+logDiv).append(`<br><span id="wordCount${wikiOrEncy}"></span>`);

	$("#"+logDiv).append(`<br><span id="source${wikiOrEncy} class="source"></span>`);

	$("#"+logDiv).append(`<br><span id="wordCount${wikiOrEncy}"></span><span id="source${wikiOrEncy}" class="source"></span>`);
	
	$("#"+div).empty();

	if (wikiOrEncy == "wiki") {
		$("#source"+wikiOrEncy).html(`Source:<br>${articles[index].wSource}`);
	}else{
		$("#source"+wikiOrEncy).html(`Source:<br>${articles[index].eSource}`);
	}
 
 	// old append without animation
	// for (let j = 0; j < wordArray.length; j++) {
	// 	for (let i = 0; i < wordArray[j].length; i++) {
	//     	$("#"+div).append(`<span id='${wikiOrEncy}${j}_${i}'>${wordArray[j][i]}</span> `);
	// 	}
	// }

	var combinedTxt = "";

	for (let j = 0; j < wordArray.length; j++) {
		for (let i = 0; i < wordArray[j].length; i++) {
	    	combinedTxt += `<span id="${wikiOrEncy}${j}_${i}" class="word">${wordArray[j][i]}</span> `;
		}
	}
 
	$("#"+div).append(combinedTxt);

	var time = 0;
	var index = 0;
	var switchOnce = true;

	function animateText(){
		time = 0;
		var timer = setInterval(function(){
			if (index <= wordArray.length-1){
				if (time <= wordArray[index].length-1) {
					$(`#${wikiOrEncy}${index}_${time}`).css("display","inline");
					time++;
				} else {
					index+=1;
					animateText();
				}
			} else {
				clearInterval(timer);
				if (switchOnce) {
					runAfterAnim();
				}
				
				switchOnce = false;

				function runAfterAnim(){ ///everything afer animation goes here
					// mainF(eArticle,eConn,"#encyText","#encyLog","ency");
					// mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");
					// canvasLines();					
				}
			}
		}, 30);
	}

	animateText();
}

function getPercentage(arr){
	let percentages = [];
	var sum = arr.reduce(add, 0);

	function add(a, b) {
	    return a + b;
	}
	for (var i = 0; i < arr.length; i++) {
		percentages.push(Math.ceil((arr[i]/sum)*100));
	}
	return percentages;
}

function pad(n){
	return(n < 10 ? '0' : '') + n;
}


$(".text").scroll(function() {	
	var encyHeight = $(encyText).scrollTop();
	var wikiHeight = $(wikiText).scrollTop();
    // var y = $(this).scrollTop();
    var $header = $("#header");
    var articlesHolderHeight = $(".text").height();

    if ( encyHeight >= 1 || wikiHeight >= 1) {
        $header.addClass('shadow');
    } else {
        $header.removeClass('shadow'); 
    }
});

$("#menu-wrapper").scroll(function() {	
    var y = $(this).scrollTop();
    console.log(y);
    var $frontpageHeader = $("#frontpage-header");
    if (y >= 1) {
        $frontpageHeader.addClass('shadow');
    } else {
        $frontpageHeader.removeClass('shadow'); 
    }
});



// import './canvas.js';

////////////////////LINES//////////////////////////
//-----------------------------------------------//

function canvasLines() {
    var canvas = document.getElementById('canvas'),
    	ctx = canvas.getContext('2d');

    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            drawStuff(); 
    }

    resizeCanvas();

    function drawStuff() {
    	// let encyColors = ["rgb(198, 198, 198)","rgb(254,228,204)","rgb(204,252,203)","rgb(243,252,202)","rgb(243,204,249)","rgb(206,253,243)","rgb(254,206,205)","rgb(204,203,252)","rgb(252,244,205)","rgb(207,236,253)","lightgray","lime"]
    	// let wikiColors = ["rgba(0,0,255,0.9)","rgb(0,255,194)","rgb(218,255,0)","rgb(255,69,0)","rgb(255,255,0)","rgb(211,0,255)","rgb(255,206,0)","rgb(0,191,255)","rgb(7,255,0)","rgb(255,20,147)","rgb(218,255,0)","#93FF6E"];

    	let encyColors = ["rgb(142, 142, 142)","rgb(252, 196, 143)","rgb(142, 255, 140)","rgb(225, 249, 112)","rgb(234, 104, 255)","rgb(104, 255, 222)","rgb(255, 97, 94)","rgb(122, 119, 255)","rgb(242, 216, 89)","rgb(107, 200, 255)","rgb(135, 135, 135)","rgb(0, 160, 0)"]
    	let wikiColors = ["rgb(0,0,255)","rgb(0, 206, 157)","rgb(165, 193, 0)","rgb(209, 56, 0)","rgb(178, 178, 0)","rgb(164, 0, 198)","rgb(216, 180, 26)","rgb(0,191,255)","rgb(6, 186, 1)","rgb(216, 17, 125)","rgb(185, 216, 0)","rgb(124, 216, 93)"];


		$(".text").scroll(function() {	
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.fillStyle= "rgb(30,30,30)";
			// ctx.rect(0, 0, canvas.width, canvas.height);
		});

		$("#wrap").mousemove(function( event ) {
			if (activeHover == null){
				$(".hl").css("box-shadow","0 3px 10px rgba(0,0,0,0.0)")
			}
			$( ".hl" ).hover(function() {
			    var classes = $(this).attr("class");
		   		var lastClass = classes.split(" ").pop();
			    activeHover = lastClass;
			}, function() {
			    activeHover = null;
			}
		);

		if (activeHover == null) {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle= "rgb(30,30,30)";
			ctx.rect(0, 0, canvas.width, canvas.height);

		}

		for (var i = 0; i < numConn; i++) {
			runLines(i,"ency", encyColors[i]);
			runLines(i,"wiki", wikiColors[i]);
		}
			
		var activeColors = wikiColors;
		function runLines(i, encyOrWiki, colorScheme){
			if (activeHover == encyOrWiki+"hl"+i) {
				displayLines(i,colorScheme, encyOrWiki);
			}
		}

		function displayLines(index, color, encyOrWiki){
			var activeConnIndex;

			if (encyOrWiki == "ency") {
				activeConnIndex = encyConnIndex;
			} else {
				activeConnIndex = wikiConnIndex;
			}

			var compX = 26;
			var compY = 60;
			var temp = "";

			if (activeHover !== null) {
				var positions1=[];
				var positions2=[];

				console.log(activeHover);

				$("."+activeHover).css("box-shadow","1px 3px 25px rgba(0,0,0,0.3)");

				ctx.clearRect(0, 0, canvas.width, canvas.height);

				function getPosDrawLine(index,span1,span2){
					positions1[index] = $("#"+encyOrWiki+span1).position();
					positions2[index] = $("#"+encyOrWiki+span2).position();

					ctx.strokeStyle = color;
					ctx.lineWidth=1;
					ctx.beginPath();
					ctx.moveTo(positions1[index].left+compX,positions1[index].top+compY);
					ctx.lineTo(positions2[index].left+compX,positions2[index].top+compY);
					ctx.closePath();
					ctx.stroke();
				}

				for (var i = 0; i < (activeConnIndex[index].length)/2; i++) {
					getPosDrawLine(i,activeConnIndex[index][i*2],activeConnIndex[index][i*2+1]);
				}

					
			}
		}

	});
    }
}


// note: improvedFindConn is working. var connectedPerSntc contains the amount of connections per sentence. now it's just a matter of applying it to getPosDrawLine, so it draws the specific number of lines stored in connectedPerSntc.
// 	uncomment improvedFindConn and comment findConn.