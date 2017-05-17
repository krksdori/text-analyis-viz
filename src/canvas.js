(function() {
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

    function drawStuff() {
    	// console.log(getPos("#ency1_5"));
    	
    	var hoverSwitches = [];
    	for (var i = 0; i < numConn; i++) {
    		hoverSwitches[i] = false;
    	}

		$("#wrap").mousemove(function( event ) {


			// displayLines(0,"blue", "ency");
			// displayLines(1,"lime", "ency");
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

				var comp = 36;
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
						getPosDrawLine(0,activeConnIndex[index][i*2],activeConnIndex[index][i*2+1]);
					}

					
				} else {
					ctx.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
		});


    }
})();




