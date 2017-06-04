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
		// appendArt(wArticle,wConn,"wikiText","wikiLog","wiki", index);

		mainF(eArticle,eConn,"#encyText","#encyLog","ency");
		// mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");
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

	for (var j = 0; j < wordArray.length; j++) {
		for (var i = 0; i < wordArray[j].length; i++) {
			wordArray[j][i] = wordArray[j][i].replace(/,/g, "");
			wordArray[j][i] = wordArray[j][i].replace(/;/g, "");
			wordArray[j][i] = wordArray[j][i].replace(/!/g, "");
			console.log(wordArray[j][i]);
		}
	}

	let infof0 = [];

	function indexAll(array, match){
	    return array.reduce(function(inds,val,i){
	        if(val == match) inds.push(i);
	        return inds;
	    },[]);
	}

	// console.log(indexAll(wordArray[0], conn[0]));
	// console.log(indexAll(wordArray[0], conn[1]));
	// console.log(conn[0]);

	console.log(wordArray[0]);

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

	$("#"+logDiv).append(`<br><span id="wordCount${wikiOrEncy}"></span>
		<br><br><span id="source${wikiOrEncy}" class="source"></span>`);
	
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

    if ( encyHeight>= 1 || wikiHeight>= 1) {
        $header.addClass('shadow');
    } else {
        $header.removeClass('shadow'); 
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

		$(".text").scroll(function() {	
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		});

		$("#wrap").mousemove(function( event ) {
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
		}

		for (var i = 0; i < numConn; i++) {
			runLines(i,"ency");
			runLines(i,"wiki");
		}
			

		function runLines(i, encyOrWiki){
			if (activeHover == encyOrWiki+"hl"+i) {
				displayLines(i,"blue", encyOrWiki);
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

			if (activeHover !== null) {
				var positions1=[];
				var positions2=[];

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