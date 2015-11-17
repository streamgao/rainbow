var mypeerid;
var peer;
var connection;
var maincanvas,ctx;
var imgs = []
var pixmatrix = [];
var brushsize, dividenum;
var wipex, wipey;
var index = 1;
var totalwiped;
var ratiox = 1;
var ratioy = 1;
var ratioimgs = 1;
var ratioimgy = 1;
var mousedown;
var alreadyondata = false;

function initpixs(){
	for(var i=0;i<dividenum;i++){
    	pixmatrix[i] = [];
    	for (var j = 0; j < Math.floor( $('#maincanvas').height()*dividenum/$('#maincanvas').width() ); j++) {
    		pixmatrix[i][j] = -1;
    	}
    }
    console.log("initpixs");
}

function initvariables(){
 	index = 1;
 	totalwiped = 0;
 	alreadyondata = false;

 	for(var i=0; i<7; i++){
	    //imgs[i] = document.getElementById("body"+i);
	    //imgs[i] = document.createElement('img');
	    imgs[i] = new Image();
		imgs[i].src='img/'+i+'.jpg';
    }
    imgs[0].height= $('#maincanvas').height();
    imgs[0].width = $('#maincanvas').width();
    document.body.appendChild(imgs[0]);
    ctx.drawImage(imgs[0], 0, 0);
    
    //init brushsize and pix cutting unit
    dividenum = 20;
    brushsize = $('#maincanvas').width() / dividenum;   //50
    wipex = 0; wipey = 0;
	ratiox = maincanvas.width / $('#maincanvas').width();
	ratioy = maincanvas.height / $('#maincanvas').height();

    //init pix matrix
    initpixs();
    console.log( "Size:"+pixmatrix.length+","+pixmatrix[0].length );
 }



var init = function() {   //receiver
	maincanvas = document.getElementById("maincanvas");
    ctx = maincanvas.getContext("2d");

	peer = new Peer({host: '104.131.82.13', port: 9000, path: '/'});
	initvariables();

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		mypeerid = id;
	});
	
	peer.on('connection', function(conn) {
		connection = conn;
		connection.on('open', function(data) {
			console.log("connect to "+document.getElementById('other_peer_id').value +"!");
		});//on open

		connection.on('data',function(data){  // receiver
			alreadyondata = true;
			//receiver(data);
			dragwipe(data.x, data.y);
		});//on connection

	});//on connection

	peer.disconnect();


   	maincanvas.addEventListener('mousedown', function(){mousedown =true;});
  	maincanvas.addEventListener('mouseup', function(){mousedown =false;});
    maincanvas.addEventListener('mousemove', function(e){
    	if (mousedown) { 
    		if( alreadyondata ){
    			connection.send({x: evtx, y: evty});
    			dragwipe(e.clientX, e.clientY); 
    		}
    	}else{//if not connecting to peers
			console.log("haven't connect to anyone!");
		}
    });//mousemove

};  //init
/*addEventListener("touchstart", handleStart, false);
  el.addEventListener("touchend", handleEnd, false);
*/


window.addEventListener('load', init);	

var dragwipe = function(evtx, evty){

		wipex = Math.floor( evtx / brushsize );
		wipey = Math.floor( evty / brushsize );
		ratioimgx = imgs[index].naturalWidth / $('#maincanvas').width(); //naturalHeight
		ratioimgy = imgs[index].naturalHeight / $('#maincanvas').height();
		console.log(ratioimgx+'ratioimgx '+ratioimgy);

		// ctx.drawImage( imgs[index], evtx*ratioimgx, evty*ratioimgy, brushsize*ratioimgx, brushsize*ratioimgy,
		// 	evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);
		if ( totalwiped < 0.8 * pixmatrix.length * pixmatrix[0].length ) {  //current image
				if ( pixmatrix[wipex][wipey]==-1 ) {

					totalwiped++;
					totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
					pixmatrix[wipex][wipey] = 1;
					console.log("imgs[index]:")
					console.log(imgs[index]);
					ctx.drawImage( imgs[index], evtx*ratioimgx, evty*ratioimgy, brushsize*ratioimgx, brushsize*ratioimgy,
						evtx*ratiox, evty*ratioy, brushsize*ratiox, brushsize*ratioy);
				}
		}else{ //switch
				totalwiped=0;
				index++;
				index = index % imgs.length;
				initpixs();
		}//else change to next image
}//dragwipe


var placecall = function(){  // sender  
 	connection = peer.connect(document.getElementById('other_peer_id').value, {reliable: false});

	connection.on('open', function(data){
		//ctx.drawImage(imgs[0], 0, 0);
		console.log("connect to "+document.getElementById('other_peer_id').value +"!");
	});//on open

	connection.on('data',function(data){
		alreadyondata = true;
		wipex = Math.floor( data.x / brushsize );
		wipey = Math.floor( data.y / brushsize );
	});//on connection data
 }//placecall


/*
function receiver(data){
	wipex = Math.floor( data.x / brushsize );
	wipey = Math.floor( data.y / brushsize );

	console.log("totalwiped:"+totalwiped);

	if ( totalwiped < 0.3 * pixmatrix.length * pixmatrix[0].length ) {  //current image
		if ( pixmatrix[wipex][wipey]== -1 ) { // if not wiped yet
			console.log("wipe");
			totalwiped++;
			totalwiped = totalwiped% (pixmatrix.length * pixmatrix[0].length);
			pixmatrix[wipex][wipey] = 1;

			console.log("imgs[index]:"+index+","+imgs[index]);

			imgs[index].onload = function(){
				ctx.drawImage( imgs[index], data.x*ratiox, data.y*ratioy, brushsize*ratiox, brushsize*ratioy ,
					data.x, data.y, brushsize, brushsize);
			}
		}
	}else{ //switch
		totalwiped=0;
		console.log("index++:"+index);
		index++;
		index = index % imgs.length;
		initpixs();
	}
}*/








