// var eArticle = getHtmlContent("wikiText");

import $ from 'jquery';
import './style.css';
import articles from './articles';



$("#wrap").hide();
$("#header").hide();


for (var i = 0; i < articles.length; i++) {
	$("#menu").append("<a id='link"+articles[i].title+"' href='#'>"+articles[i].title+"</a><br>");
	menuClickExecute(articles[i].title, i);
}

$( "#back-button" ).click(function() {
  $("#wrap").hide();
  $("#header").hide();
  $("#menu-wrapper").removeClass("hidden");
});

var eArticle;
var wArticle;
var eConn;
var wConn;
var currentTitle;

function menuClickExecute(link, index){
	$( "#link"+link ).click(function() {
		$("#wrap").show();
		$("#header").show();

		eArticle = articles[index].eArt;
		wArticle = articles[index].wArt;
		eConn = articles[index].eConn;
		wConn = articles[index].wConn;
		currentTitle = articles[index].title;

		appendArt(eArticle,eConn,"encyText","encyLog","ency");
		appendArt(wArticle,wConn,"wikiText","wikiLog","wiki");

		// mainF(eArticle,eConn,"#encyText","#encyLog","ency");
		// mainF(wArticle,wConn,"#wikiText","#wikiLog","wiki");

		$("#menu-wrapper").addClass("hidden");
	
		$("#wrap").removeClass("hidden");
		$("#header").removeClass("hidden");

		var $encyTitleDiv = $('<div>').addClass("ency-header-title header-title").text("Encyclopedia – " + currentTitle);
		var $wikiTitleDiv = $('<div>').addClass("wiki-header-title header-title").text("Wikipedia – " + currentTitle);

    	$('#header').append($encyTitleDiv);
    	$('#header').append($wikiTitleDiv);

	});
}

let numConn = 10;
let encyConnIndex = [];
let wikiConnIndex = [];

function mainF(art,conn,textDest,logDest, wikiOrEncy){
	console.log("a");
	let lowerCaseArt = art.toLowerCase();
	let splArt = lowerCaseArt.split(".");
	let wordArray = [];
	let count = [];
	let wordCount = 0;

	for (var i = 0; i < numConn; i++) {
		count.push(0);
		encyConnIndex[i]=[];
		wikiConnIndex[i]=[];
	}

	for (let i = 0; i < splArt.length; i++) {
		wordArray.push(splArt[i].split(" "));
	}

	// console.log(wordArray);

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
			} else {
				wikiConnIndex[searchNo].push(index+"_"+indof0);
				wikiConnIndex[searchNo].push(index+"_"+indof1);
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
		$("#"+logDiv).append(`<span class='${wikiOrEncy}hl${i}'>${conn[i*2]} + ${conn[(i*2)+1]} </span>&nbsp;<span id='${wikiOrEncy}ConnCount${i}'></span><br>`);
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
    // console.log(articlesHolderHeight);
    if (y >= 1) {
        $header.addClass('shadow');
    } else {
        $header.removeClass('shadow'); 
    }
});
