// individual options for every board
/*
var iOthelly_options = { 
	1 : {'moveFirst' : 'WHITE', 'size' : 30, 'rowsCols' : 8, 'imgPath' : 'images/'},
	2 : {'moveFirst' : 'WHITE', 'size' : 30, 'rowsCols' : 8, 'imgPath' : 'images/'},
	3 : {'moveFirst' : 'WHITE', 'size' : 30, 'rowsCols' : 8, 'imgPath' : 'images/'}
}
*/
// general options for all boards in a page
//var Othelly_options = {
	/*
	'imgPath' : 'images/',
	
	'piecewidth' : 25,
	'pieceheight' : 25,
	'width' : 8,
	'height' : 8,
	*/
	// messages (uncomment a language if you want the messages under the game in that language)
	/*
	// English (default)
	'PlayerWhite' : 'WHITE',
	'PlayerBlack' : 'BLACK',
	'PlayerTurn' : '\'s turn', // BLACK or WHITE 
	'PlayerHasWon' : ' has won',	// BLACK or WHITE 
	'PlayerMustPass' : ' must pass!',// BLACK or WHITE 
	'PlayerNoMoves' : 'No more moves!',
	'Draw' : 'It\'s a draw!',
	*/
	// French
	/*
	'PlayerWhite' : 'BLANC',
	'PlayerBlack' : 'NOIR',
	'PlayerTurn' : ' doit jouer',
	'PlayerHasWon' : '  a gagné',
	'PlayerMustPass' : ' doit passer!',
	'PlayerNoMoves' : 'Il n'y a pas de mouvements!',
	'Draw' : 'Égalité!',
	*/
	// German
	/*
	'PlayerWhite' : 'WEISS',
	'PlayerBlack' : 'SCHWARZ',
	'PlayerTurn' : ' ist am Zug',
	'PlayerHasWon' : ' hat gewonnen',
	'PlayerMustPass' : ' muss passen!',
	'PlayerNoMoves' : 'Es gibt keine Spielzüge mehr!',
	'Draw' : 'Untentschieden!',
	*/
	/*
	'human' : 1,
	'moveFirst' : 1,
	'humanVsHuman' : true,
	'showcursor' : true,
	'showflips' : false,
	'weightsquares' : true,
	'edgesensitive' : true,
	*/
//}
// holder for all created boards
var	Othelly_boards = [];
// start the process of changing the coded Othello games in a HTML page into graphical interfaces
// this function has to be called after the page has loaded (window.onload.initOthelloBoards; or <body onload="initOthelloBoards()">)
function initOthellyBoards(iOptions) {
	// collect the div elements with class "othello-game" where the games shall be inserted
	var input = null;
	var coll = document.getElementsByTagName('div');
	var divColl = [];
	for(var x=0; x<coll.length; x++)
	{
		divColl.push(coll[x]);
	}	
	var pre1 = null;
	var j = 1;
	
	for(var i=0; i<divColl.length; i++)
	{
		var matrix = '';
		var options = {};
		if(typeof Othelly_options != 'undefined')
		{
			options = clone(Othelly_options);
		}
		// extract the pre-element if there is one
		if(divColl[i].getAttribute('class') && divColl[i].getAttribute('class').indexOf('othello-game') > -1 && !divColl[i].getAttribute('id'))
		{
			// adapt specific OTHELLY's
			if(typeof iOptions != 'undefined' && typeof iOptions == 'object')
			{
				for(var z in iOptions)
				{
					if(z == i)
					{
						if(typeof iOptions[z]['moveFirst'] != 'undefined')
						{
							options['moveFirst'] = iOptions[z]['moveFirst'] == 'WHITE' ? 2 : 1;
							options['human'] = iOptions[z]['moveFirst'] == 'WHITE' ? 2 : 1;
						}
						
						if(typeof iOptions[z]['size'] != 'undefined')
						{
							options['piecewidth'] = iOptions[z]['size'];
							options['pieceheight'] = iOptions[z]['size'];
						}
						
						if(typeof iOptions[z]['rowsCols'] != 'undefined')
						{
							options['width'] = iOptions[z]['rowsCols'];
							options['height'] = iOptions[z]['rowsCols'];
						}
						
						if(typeof iOptions[z]['imgPath'] != 'undefined')
						{
							options['imgPath'] = iOptions[z]['imgPath'];
						}
					}
				}
			}
		
			var div = document.createElement('div');
			div.setAttribute('id', 'Game_' + j);
			div.setAttribute('class', 'gContainer');
			
			if(input = divColl[i].getElementsByTagName('input')[0])
			{
				input.style.display = 'block';
				input.setAttribute('id', 'Input_' + j);
			}
			// find gameboard defined in text-format (White = O, Black = # or X, Empty = . or -) and assigned with pre-tags
			if(typeof (pre1 = divColl[i].getElementsByTagName('pre')[0]) != 'undefined')
			{
				matrix = pre1.firstChild.nodeValue.trim();
				
				divColl[i].replaceChild(div, pre1);
			}
			else
			{
				divColl[i].insertBefore(div, input);
			}
			
			options['gameNo'] = j;
			options['matrix'] = matrix;
			Othelly_boards[j] = new Othelly(options);	
			Othelly_boards[j].InitializeBoard(div);
			j++;
		}
	}
}

// JavaScript Othello Game
// Copyright (c) 2000, 2001 Kelly Yancey <kbyanc@posi.net>
// All rights reserved.
//
// Redistribution and use in source form, with or without modification, is
// permitted provided that the following conditions are met:
// 1. Redistributions of source code must retain the above copyright
//    notice, this list of conditions and the following disclaimer,
//    without modification, immediately at the beginning of the file.
// 2. All advertising materials mentioning features or use of this software
//    must display the following acknowledgement:
//      This product includes software developed by Kelly Yancey
//    and a reference to the URL http://www.posi.net/software/othello/
// 3. The name of the author may not be used to endorse or promote products
//    derived from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
// IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
// OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
// IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
// NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
// THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
// game modified by Jürgen Müller-Lütken 10/2013; kontakt@p-six.de


// the class
function Othelly(options)
{
	var 	_imgPath = 'images/';
	// board settings
	var		_piecewidth = 20;
	var		_pieceheight = 20;
	var 	_width = 8;
	var 	_height = 8;
	var		_matrix = '........\n........\n........\n...O#...\n...#O...\n........\n........\n........';
	// messages
	var		_PlayerBlack = 'BLACK';
	var		_PlayerWhite = 'WHITE';
	var 	_PlayerTurn = '\'s turn';
	var 	_PlayerHasWon = ' has won the game';
	var 	_PlayerMustPass = ' must pass!';
	var 	_PlayerNoMoves = 'There are no more moves!';
	var 	_Draw = 'It\'s a draw!';
	// player settings
	
	var		_humanVsHuman = true;      // play human versus human
	var     _showcursor = true;        // display cursor showing user where they can go
	var     _showflips = false;        // display counts showing how many pieces they can flip by putting a piece in a given square

	// AI settings
	var     _weightsquares = true;        // whether AI prefers squares that yield higher flip counts
	var     _edgesensitive = true;        // whether AI is sensitive to the importance of edge squares
	var		_gameNo = 0;

	// some internal variables
	var     _board = new Array(_width);
	var     _score = new Array();
			_score[1] = 0;
			_score[2] = 0;
	
	var     _AI_timerID;

	var 	_self = this;
	var		_EMPTY = 0;
	var 	_BLACK = 1;
	var 	_WHITE = 2;
	var 	_WHITETRANS = 3;
	var 	_BLACKTRANS = 4;
	var 	_NUMBASE = 5;
	
	var     _human = _BLACK;
	var     _turn = _BLACK;
	var 	_moveFirst = 1;
	
	
	var		_moves = 0;
	var		_fmoves = 0;
	var 	_picture = [];
	var		_lastMove = {'x' : -1, 'y' : -1};
	var		_History = [];
	var		_Gains = [];
	var		_GameplayStr = '';
	var		_Gameplay = [];
	var		_moveBack = false;
	var		_replayMode = true;
	
	var 	_moveMatrix = '';
	var		_ie = false;
	var		_Notation = {'a':0, 'b':1, 'c':2, 'd':3, 'e':4, 'f':5, 'g':6, 'h':7, 0:'a', 1:'b', 2:'c', 3:'d', 4:'e', 5:'f', 6:'g', 7:'h'};
	
	function _initializeGame(options)
	{
		if(typeof options != 'undefined')
		{
			_imgPath = (typeof options.imgPath != 'undefined' && options.imgPath != '') ? options.imgPath : _imgPath;
			_piecewidth = (typeof options.piecewidth != 'undefined' && options.piecewidth != 0) ? options.piecewidth : _piecewidth;
			_pieceheight = (typeof options.pieceheight != 'undefined' && options.pieceheight != 0) ? options.pieceheight : _pieceheight;
			_width = (typeof options.width != 'undefined' && options.width != 0) ? options.width : _width;
			_height = (typeof options.height != 'undefined' && options.height != 0) ? options.height : _height;
			
			_matrix = (typeof options.matrix != 'undefined' && options.matrix != '') ? _SetMatrix(options.matrix) : _matrix;
			// player settings
			_human = (typeof options.human != 'undefined' && options.human != 0) ? options.human : _human;
			_humanVsHuman = (typeof options.humanVsHuman != 'undefined' && options.humanVsHuman != 0) ? options.humanVsHuman : _humanVsHuman;
			_showcursor = (typeof options.showcursor != 'undefined' && options.showcursor != 0) ? options.showcursor : _showcursor;
			_showflips = (typeof options.showflips != 'undefined' && options.showflips != 0) ? options.showflips : _showflips;

			// AI settings
			_weightsquares = (typeof options.weightsquares != 'undefined' && options.weightsquares != 0) ? options.weightsquares : _weightsquares;
			_edgesensitive = (typeof options.edgesensitive != 'undefined' && options.edgesensitive != 0) ? options.edgesensitive : _edgesensitive;
			_gameNo = (typeof options.gameNo != 'undefined' && options.gameNo != 0) ? options.gameNo : _gameNo;
			
			_moveFirst = (typeof options.moveFirst != 'undefined' && options.moveFirst != 0) ? options.moveFirst : _moveFirst;
			_turn = _moveFirst;
			
			// messages
			_PlayerBlack = (typeof options.PlayerBlack != 'undefined' && options.PlayerBlack != 0) ? options.PlayerBlack : _PlayerBlack;
			_PlayerWhite = (typeof options.PlayerWhite != 'undefined' && options.PlayerWhite != 0) ? options.PlayerWhite : _PlayerWhite;
			_PlayerTurn = (typeof options.PlayerTurn != 'undefined' && options.PlayerTurn != 0) ? options.PlayerTurn : _PlayerTurn;
			_PlayerHasWon = (typeof options.PlayerHasWon != 'undefined' && options.PlayerHasWon != 0) ? options.PlayerHasWon : _PlayerHasWon;
			_PlayerMustPass = (typeof options.PlayerMustPass != 'undefined' && options.PlayerMustPass != 0) ? options.PlayerMustPass : _PlayerMustPass;
			_PlayerNoMoves = (typeof options.PlayerNoMoves != 'undefined' && options.PlayerNoMoves != 0) ? options.PlayerNoMoves : _PlayerNoMoves;
			_Draw = (typeof options.Draw != 'undefined' && options.Draw != 0) ? options.Draw : _Draw;
		}
		
		_LoadPieceImage(_EMPTY, _imgPath + "blank.gif");
		_LoadPieceImage(_WHITE, _imgPath + "white.gif");
		_LoadPieceImage(_BLACK, _imgPath + "black.gif");
		_LoadPieceImage(_WHITETRANS, _imgPath + "white-trans.gif");
		_LoadPieceImage(_BLACKTRANS, _imgPath + "black-trans.gif");

		// load number images (must have at least 0-21)
		for(i = 0; i <= 21; i++)
		{
			_LoadPieceImage(_NUMBASE + i, _imgPath + "trans-" + i + ".gif");
		}
	}

	function _LoadPieceImage(picnum, pictureURL) 
	{
		// routine to associate the given picture with a picture number.
		_picture[picnum] = new Image();
		_picture[picnum].src = pictureURL;
	}
	
	function _piece(imagename) {
	// object definition for 'piece' type
	    this.imagename = imagename;
	    this.player = _EMPTY;
	    // how many pieces each player could flip by taking this square
	    this.flips = new Array();
	    this.flips[_WHITE] = 0;
	    this.flips[_BLACK] = 0;
	    // how valuable this location is to each player
	    this.value = new Array();
	    this.value[_WHITE] = 0;
	    this.value[_BLACK] = 0;
	}

	function _SetPieceImage(x, y, src) {
	// routine to set the image associated with the given piece
	    if(document.images[_board[x][y].imagename].src != src) {
	        // we explicitely check to see if we are changing the image source to prevent
	        // unnecessary redrawing of images which do not change
	        document.images[_board[x][y].imagename].src = src;
	    }
	}
	
	function _SetMatrix(matrix)
	{
		if(matrix.indexOf('()') != -1)
		{
			_moveMatrix = matrix;
			return _matrix;
		}
		else
		{
			return matrix.replace(/ /g, '').trim();
		}
	}
	
	function _EncodeTranskript(str)
	{
		var moves = [];
		var cols = [];
		var s = _ie ? '\r' : '\n';
		var lines = str.trim().split(s);
		if(lines.length && lines.length > 0)
		{
			for(var i=0; i<lines.length; i++)
			{
				if(lines[i].indexOf(' ') == -1)
				{
					for(var j=0; j<lines[i].length; j+=2)
					{
						cols.push(lines[i].substr(j, 2));
					}
				}
				else
				{
					cols = lines[i].split(' ');
				}
				if(cols.length && cols.length > 0)
				{
					for(var j=0; j<cols.length; j++)
					{
						if(!isNaN(cols[j]))
						{
							moves[Math.abs(cols[j])] = _Notation[j] + (i + 1);
						}
					}
				}
			}
		}
		return moves.join('');
	}

	this.InitializeBoard = function(container) {
		var div, table, tbody, tr, td, img, val, player, gp;
		var _boardheight = (_height + 2) * _pieceheight + ((_height + 2) * 4) + 2;
		var _boardwidth = (_width + 2) * _piecewidth + ((_width + 2) * 4) + 2;
		
		_ie = navigator.appName.indexOf('Microsoft') > -1;
		
		if(_moveMatrix != '') 
		{
			var c = '';
			if(_moveMatrix.indexOf('>') != -1)
			{
				var temp = _moveMatrix.split('>');
				_moveMatrix = temp[0];
				c = '>' + temp[1];
			}
			document.getElementById('Input_' + _gameNo).setAttribute('value', _EncodeTranskript(_moveMatrix) + c);
		}
		var s = _ie ? '\r' : '\n';
		
		var lines = _matrix.split(s);
		
		// routine to initialize the state of the game and draw the board
	    // build the board array
	    for(var x = 0; x < _width; x++)
		{
	        _board[x] = new Array(_height);
		}
		div = document.createElement('div');
		div.setAttribute('id', 'd_' + _gameNo);
		table = document.createElement('table');
		tbody = document.createElement('tbody');
		var _x = _y = 0;
	    for(var y = 0; y < _height + 2; y++) 
		{
			tr = document.createElement('tr');
			tbody.appendChild(tr);
			if(_matrix && y > 0 && y < _height + 1)
			{
				var tiles = lines[_y].trim().split('');
			}
	        for(x = 0; x < _width + 2; x++) 
			{
	            // place initial pieces
				td = document.createElement('td');
				
				td.style.width = _piecewidth + 'px';
				td.style.height = _pieceheight + 'px';
				if(y == 0)
				{
					td.setAttribute('class', 'border');
					if((x > 0 && x < _width + 1))
					{
						val = document.createTextNode(_Notation[x-1]);
						td.appendChild(val);
						
						tr.appendChild(td);
					}
					else
					{
						tr.appendChild(td);
					}
				}
				if(y > 0 && y < _height + 1 && x == 0)
				{
					if(x == 0)
					{
						val = document.createTextNode(String(y));
						td.appendChild(val);
						td.setAttribute('class', 'border');
						td.style.fontSize = Math.floor(_pieceheight / 100 * 80) + 'px';
						td.style.lineHeight = Math.floor(_pieceheight / 100 * 80) + 'px';
						tr.appendChild(td);
					}
				}
				else if(y > 0 && y < _height + 1 && x > 0 && x < _width + 1)
				{
					if(_matrix)
					{
						switch(tiles[_x])
						{
						
							case 'O':
							player = _WHITE;
							_score[_WHITE]++;
							_moves++;
							break;
							
							case '#':
							case 'X':
							player = _BLACK;
							_score[_BLACK]++;
							_moves++;
							break;
							
							case '.':
							case '-':
							player = _EMPTY;
							break;
						}
					}
					else
					{
			            if((_x == (_width/2)-1 && _y == (_width/2)-1) || (_x == _width/2 && _y == _width/2)) {
							player = _WHITE;
							_score[_WHITE]++;
						}
			            else if((_x == (_width/2)-1 && _y == _width/2) || (_x == _width/2 && _y == (_width/2)-1)) {
							player = _BLACK;
							_score[_BLACK]++;
						}
			            else player = _EMPTY;
					}
					
					td.x = _x;
					td.y = _y;
					td.onclick = function() { _self.hPutPiece(this.x, this.y); };
					td.onmouseover = function() { _self.CheckPutPiece(this.x, this.y); };
					td.onmouseout = function() { _self.RestorePiece(this.x, this.y); };
					img = document.createElement('img');
					img.setAttribute('name', 'c_'+_gameNo+'[' + _x + ',' + _y + ']');
					img.setAttribute('id', 'c_'+_gameNo+'[' + _x + ',' + _y + ']');
					img.setAttribute('src', _picture[player].src);
					img.setAttribute('width', _piecewidth);
					img.setAttribute('height', _pieceheight);
					td.appendChild(img);
					tr.appendChild(td);
					_board[_x][_y] = new _piece('c_'+_gameNo+'[' + _x + ',' + _y + ']');
					_board[_x][_y].player = player;
					_x++;
					if(_x > _width - 1)
					{
						_x = 0;
					}
					
				}
				else if(y < _height + 2)
				{
					td.setAttribute('class', 'border');
					td.style.fontSize = Math.floor(_pieceheight / 100 * 80) + 'px';
					td.style.lineHeight = Math.floor(_pieceheight / 100 * 80) + 'px';
					tr.appendChild(td);
				}
				
	        }
			if(y > 0 && y < _height + 1)
			{
				_y++;
			}
			tbody.appendChild(tr);
	    }
		table.appendChild(tbody);
		table.style.height = (_height + 2) * _pieceheight + ((_height + 2) * 4) + 2 + 'px';
		table.style.width = (_width + 2) * _piecewidth + ((_width + 2) * 4) + 2 + 'px';
		div.appendChild(table);
		container.style.width = (_width + 2) * _piecewidth + ((_width + 2) * 4) + 2 + 'px';
		container.appendChild(div);
		
		div = document.createElement('div');
		div.setAttribute('class', 'gamedata');
		
		var p = document.createElement('p');
		val = document.createTextNode(_PlayerBlack + ': ');
		p.appendChild(val);
		
		var span = document.createElement('span');
		span.setAttribute('id', 'Game_' + _gameNo + 'Blacks');
		p.appendChild(span);
		
		val = document.createTextNode('');
		p.appendChild(val);
		span = document.createElement('span');
		span.setAttribute('id', 'Game_' + _gameNo + 'Moves');
		p.appendChild(span);
		
		val = document.createTextNode(_PlayerWhite + ': ');
		p.appendChild(val);
		span = document.createElement('span');
		span.setAttribute('id', 'Game_' + _gameNo + 'Whites');
		span.setAttribute('class', 'whiteScore');
		p.appendChild(span);
		div.appendChild(p);
		
		p = document.createElement('p');
		p.style.textAlign = 'center';
		p.setAttribute('id', 'Message_' + _gameNo);
		div.appendChild(p);
		container.appendChild(div);
		
		div = document.createElement('div');
		div.setAttribute('class', 'gamecontrol');
		
		// back buttons
		var but = document.createElement('button');
		but.setAttribute('type', 'button');
		but.setAttribute('class', 'back end');
		but.i = _gameNo;
		val = document.createTextNode('<<');
		but.onclick = function() { _self.MoveToStart(); };
		but.appendChild(val);
		div.appendChild(but);
		
		but = document.createElement('button');
		but.setAttribute('type', 'button');
		but.setAttribute('class', 'back step');
		but.i = _gameNo;
		val = document.createTextNode('<');
		but.onclick = function() { _self.MoveBack(); };
		but.appendChild(val);
		div.appendChild(but);
		
		// forward buttons
		but = document.createElement('button');
		but.setAttribute('type', 'button');
		but.setAttribute('class', 'forward end');
		but.i = _gameNo;
		val = document.createTextNode('>>');
		but.onclick = function() { _self.MoveToEnd(); };
		but.appendChild(val);
		div.appendChild(but);
		
		but = document.createElement('button');
		but.setAttribute('type', 'button');
		but.setAttribute('class', 'forward step');
		but.i = _gameNo;
		val = document.createTextNode('>');
		but.onclick = function() { _self.MoveForward(); };
		but.appendChild(val);
		div.appendChild(but);
		
		var inp = document.createElement('input');
		inp.setAttribute('type', 'text');
		inp.setAttribute('value', document.getElementById('Input_'+ _gameNo).getAttribute('value'));
		inp.setAttribute('class', 'gameplay');
		inp.style.display = 'block';
		div.appendChild(inp);
		
		but = document.createElement('button');
		but.setAttribute('type', 'button');
		but.setAttribute('class', 'reset');
		but.i = _gameNo;
		val = document.createTextNode('Reset');
		but.onclick = function() { _self.ResetBoard(); };
		but.appendChild(val);
		div.appendChild(but);
		
		container.appendChild(div);
		container.parentNode.removeChild(document.getElementById('Input_' + _gameNo));
		
		inp.setAttribute('id', 'Input_' + _gameNo);
		
		// decrement the first four discs because they weren't set
		if(_moves > 0)
		{
			_moves -= 4;
		}
		
		if((gp = _FormatGameplayStr(document.getElementById('Input_' + _gameNo).getAttribute('value'))) != '')
		{
			_ReadGameplay(gp);
			_replayMode = true;
			inp.value = '';
			inp.setAttribute('value', '');
		}
		
		_ShowScore();
		_ShowMessage((_moveFirst == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerTurn)
	}

	this.ResetBoard = function() {
	// routine to reset all of the pieces on the board
	    // cancel any pending AI task
	    if(_AI_timerID != undefined) {
	        clearTimeout(_AI_timerID);
	        _AI_timerID = undefined;
	    }
		// remove marker of last move
		if(_moves >= 1 && typeof _History[_moves] != 'undefined')
		{
			var lastPiece = _History[_moves].split(',');
			_UnmarkMove(lastPiece[0], lastPiece[1], _human);
			_lastMove.x = -1;
			_lastMove.y = -1;
		}
		// reset scores
		_score[_WHITE] = 0;
		_score[_BLACK] = 0;
		_moves = 0;
		_fmoves = 0;
		_Gameplay = [];
		_History = [];
		_Gains = [];
		_moveBack = false;

	    // reset the board
		if(_matrix)
		{
			var s = _ie ? '\r' : '\n';
			var lines = _matrix.trim().split(s);
			for(y = 1; y <= _height; y++) {
		        for(x = 1; x <= _width; x++) {
					var tiles = lines[y-1].trim().split('');
					
					switch(tiles[x-1])
					{
						case 'O':
						_board[x-1][y-1].player = _WHITE;
						_SetPieceImage(x-1, y-1, _picture[_WHITE].src);
						_score[_WHITE]++;
						_moves++;
						break;
						
						case '#':
						case 'X':
						_board[x-1][y-1].player = _BLACK;
						_SetPieceImage(x-1, y-1, _picture[_BLACK].src);
						_score[_BLACK]++;
						_moves++;
						break;
						
						case '.':
						case '-':
						_board[x-1][y-1].player = _EMPTY;
						_SetPieceImage(x-1, y-1, _picture[_EMPTY].src);
						break;
					}
		        }
		    }
			_moves -= 4;
		}
		else
		{
		    for(y = 1; y <= _height; y++) {
		        for(x = 1; x <= _width; x++) {
		            _board[x-1][y-1].player = _EMPTY;
		            _SetPieceImage(x-1, y-1, _picture[_EMPTY].src);
		        }
		    }
		    // put initial pieces back on the board
		    _RawPutPiece(_width/2-1, _width/2-1, _WHITE);
		    _RawPutPiece(_width/2, _width/2, _WHITE);
		    _RawPutPiece(_width/2-1, _width/2, _BLACK);
		    _RawPutPiece(_width/2, _width/2-1, _BLACK);
		}
		
		if((gp = _FormatGameplayStr(document.getElementById('Input_' + _gameNo).getAttribute('value'))) != '' && _replayMode && _GameplayStr.indexOf(gp) == -1)
		{
			_ReadGameplay(gp);
		}
		else
		{
			_ReadGameplay(_GameplayStr);
		}
		document.getElementById('Input_' + _gameNo).value = '';
		document.getElementById('Input_' + _gameNo).setAttribute('value', '')
		_replayMode = true;
		
	    _turn = _human = _moveFirst;
		_ShowScore();
		_ShowMessage((_moveFirst == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerTurn)
	}
	
	function _FormatGameplayStr(str)
	{
		return str.replace(/\s\s*/g, '').toLowerCase();
	}
	
	function _ReadGameplay(gameplay)
	{
		var moves = _moves;
		_GameplayStr = gameplay;
		
		// are the number of moves attached where to go?
		if(gameplay.indexOf('>') != -1)
		{
			var temp = gameplay.split('>');
			gameplay = temp[0];
			_fmoves = Number(temp[1]) - moves;
		}
		
		for(var i=0; i<gameplay.length; i+=2)
		{
			var val = gameplay.substr(i, 2).split('');
			_Gameplay[moves++] = _Notation[val[0]] + ',' + (Number(val[1]) - 1);
		}
		
		if(_fmoves > 0)
		{
			_SetGameStatus();
		}
	}
	
	// set a piece on the board
	this.PutPiece = function(x, y) {
	    if(!_CanPutPiece(x, y, _human)) return false;
	    _FlipPieces(x, y, _human);
		_MarkMove(x, y, _human);
	    _DoneTurn();
		return true;
	}
	
	// set a piece in replay mode (forward button / back button)
	this.rPutPiece = function(x, y)
	{
		_replayMode = true;
		this.PutPiece(x, y);
	}
	
	// set a piece by human clicking on the board
	this.hPutPiece = function(x, y)
	{
		_replayMode = false;
		this.PutPiece(x, y);
	}
	
	function _CanPutPiece(x, y, player) {
	// determine whether the player can put a piece at the given position
	    if(_turn != player)
	        return false;
	    if(_board[x][y].player != _EMPTY)
	        return false;
	    return _NumFlips(x, y, player) > 0;
	}
	
	function _NumFlips(x, y, player) {
	    var deltax, deltay, distance;
	    var posx, posy;
	    var count = 0;

	    for(deltay = -1; deltay <= 1; deltay++) {
	        for(deltax = -1; deltax <= 1; deltax++) {
	            for(distance = 1;; distance++) {
	                posx = x + (distance * deltax);
	                posy = y + (distance * deltay);
	                // stop if we go off the board
	                if(posx < 0 || posx >= _width || posy < 0 || posy >= _height)
	                    break;
	                // stop when we reach an empty square
	                if(_board[posx][posy].player == _EMPTY)
	                    break;
	                // only update the flip count when we reach another of the
	                // player's pieces
	                if(_board[posx][posy].player == player) {
	                    count += distance - 1;
	                    break;
	                }
	            }
	        }
	    }
	    return count;
	}
	
	function _FlipPieces(x, y, player) {
	    var deltax, deltay, distance;
	    var posx, posy;
	    var count = 0;
		
		// put a piece down at the desired location
		_RawPutPiece(x, y, player);
		_History[++_moves] = x + ',' + y;
		_ShowHistory();
		
		_Gains[_moves] = '';
	    for(deltay = -1; deltay <= 1; deltay++) {
	        for(deltax = -1; deltax <= 1; deltax++) {
	            for(distance = 1; distance <= _width; distance++) {
	                posx = x + (distance * deltax);
	                posy = y + (distance * deltay);
	                // stop if we go off the board
	                if(posx < 0 || posx >= _width || posy < 0 || posy >= _height)
	                    break;
	                // stop when we reach an empty square
	                if(_board[posx][posy].player == _EMPTY)
	                    break;
	                if(_board[posx][posy].player == player) {
	                    // backtrack, flipping pieces
	                    for(distance--; distance > 0; distance--) {
	                        posx = x + (distance * deltax);
	                        posy = y + (distance * deltay);
	                        _RawPutPiece(posx, posy, player);
							_Gains[_moves] += '#' + posx + ',' + posy;
	                    }
	                    break;
	                }
	            }
	        }
	    }
		_Gains[_moves] = _Gains[_moves].substring(1);
	    return count;
	}
	
	function _RawPutPiece(x, y, player) {
	    var other = _OtherPlayer(player);
	    if(_board[x][y].player == other) _score[other]--;

	    _board[x][y].player = player;
	    _SetPieceImage(x, y, _picture[player].src);
	    _score[player]++;
	}
	
	function _ShowHistory()
	{
		var history = '';
		var lastPiece = _History[_moves].split(',');
		var p = (_History[_moves] != _lastMove.x + ',' + _lastMove.y) ? 1 : 0;
		for(var i=1; i<_moves + p; i++)
		{
			if(typeof _History[i] != 'undefined' && _History[i] != '')
			{
				lastPiece = _History[i].split(',');
				history += ' ' + _Notation[lastPiece[0]] + String(Number(lastPiece[1]) + 1);
			}
		}
		document.getElementById('Input_' + _gameNo).value = history;
		document.getElementById('Input_' + _gameNo).setAttribute('value', history);
	}
	
	function _ShowScore(Text)
	{
		var obj1, obj2;
		if((obj1 = document.getElementById("Game_" + _gameNo + "Whites")) != null && (obj2 = document.getElementById("Game_" + _gameNo + "Blacks")) != null)
		{
			obj1.innerHTML = _score[_WHITE];
			obj2.innerHTML = _score[_BLACK];
		}
		if((obj1 = document.getElementById("Game_" + _gameNo + "Moves")) != null)
		{
			if(_History[_moves])
			{
				var lastPiece = _History[_moves].split(',');
				obj1.innerHTML = _moves + '.' + _Notation[lastPiece[0]] + String(Number(lastPiece[1]) + 1);
			}
			else
			{
				obj1.innerHTML = _moves
			}
		}
	}
	
	function _ShowMessage(Message)
	{
		if(typeof Message == 'string')
		{
			document.getElementById("Message_" + _gameNo).innerHTML = Message;
		}
	}

	

	function _CalcFlipCounts() {
	    var x, y;

	    for(y = 0; y < _height; y++) {
	        for(x = 0; x < _width; x++) {
	            _board[x][y].flips[_WHITE] = 0;
	            _board[x][y].flips[_BLACK] = 0;

	            if(_board[x][y].player != _EMPTY) continue;

	            _board[x][y].flips[_WHITE] = _NumFlips(x, y, _WHITE);
	            _board[x][y].flips[_BLACK] = _NumFlips(x, y, _BLACK);
	        }
	    }
	}
	
	function _AnyMoves(player) {
	    var x, y;

	    for(y = 0; y < _height; y++) {
	        for(x = 0; x < _width; x++) {
	            if(_board[x][y].player != _EMPTY) continue;
	            if(_NumFlips(x, y, player) > 0) return true;
	        }
	    }
	    return false;
	}

	

	this.CheckPutPiece = function(x, y) {
	    var over;
		
	    if(!_showcursor) return;
	    if(!_CanPutPiece(x, y, _human)) return;

	    if(_human == _WHITE) over = _WHITETRANS;
	    else over = _BLACKTRANS;
	    _SetPieceImage(x, y, _picture[over].src);
	}

	this.RestorePiece = function(x, y) {
	    if(_showflips && _RawShowFlipCount(x, y, _human)) return;
	    _SetPieceImage(x, y, _picture[_board[x][y].player].src);
	}

	
	
	function _MarkMove(x, y, human)
	{
		if(_lastMove.x != -1 && _lastMove.y != -1)
		{
			_UnmarkMove(_lastMove.x, _lastMove.y);
		}
		var s = document.createElement('span');
		s.style.position = 'absolute';
		s.style.display = 'block';
		s.style.width = _piecewidth + 'px';
		s.style.height = _pieceheight + 'px';
		s.style.margin = '0';
		s.style.fontFamily = 'sans-serif';
		s.style.fontSize = '10px';
		s.style.textAlign = 'center';
		s.style.lineHeight = _pieceheight + 'px';
		s.style.color = human == _WHITE ? '#000' : '#FFF';
		var t = document.createTextNode(String(_moves));
		s.appendChild(t);
		document.getElementById(_board[x][y].imagename).parentNode.insertBefore(s, document.getElementById(_board[x][y].imagename));
		
		_lastMove.x = x;
		_lastMove.y = y;
	}
	
	function _UnmarkMove(x, y)
	{
		var k = document.getElementById(_board[x][y].imagename).parentNode.firstChild;
		document.getElementById(_board[x][y].imagename).parentNode.removeChild(k);
	}

	
	this.MoveForward = function()
	{
		var str = '';
		var coords = [];
		
		if(_replayMode)
		{
			if(_Gameplay.length && _moves < _Gameplay.length)
			{
				coords = _Gameplay[_moves].split(',');
				this.PutPiece(Number(coords[0]), Number(coords[1]));
				
			}
			else
			{
				_ShowMessage(_PlayerNoMoves);
				return false;
			}
		}
		else
		{
		
			if(typeof _History[_moves + 1] != 'undefined')
			{
				coords = _History[_moves + 1].split(',');
				if(!this.PutPiece(Number(coords[0]), Number(coords[1])))
				{
					_ShowMessage(_PlayerNoMoves);
					return false;
				}
				
			}
			else
			{
				_ShowMessage(_PlayerNoMoves);
				return false;
			}
		}
		return true;
	}

	
	this.MoveBack = function()
	{
		if(_turn == _EMPTY)
		{
			_turn = _moveFirst;
		}
		if(_moves >= 1 && typeof _History[_moves] != 'undefined')
		{
			_moveBack = true;
			_AI_timerID = clearTimeout(_AI_timerID);
			_SetBackMoves();
			return true;			
		}
		else
		{
			_ShowMessage(_PlayerNoMoves);
			return false;
		}
	}
	// move forward in the transkript of the game to the set number
	function _SetGameStatus()
	{
		for(var i=0; i<_fmoves; i++)
		{
			setTimeout(function() { _self.MoveForward() }, 100);
		}
	}
	
	this.MoveToStart = function()
	{
		if(_moves > 0 && this.MoveBack())
		{
			setTimeout(function() { _self.MoveToStart() }, 20);
		}
	}
	
	this.MoveToEnd = function()
	{
		if(_moves < _Gameplay.length && this.MoveForward())
		{
			setTimeout(function() { _self.MoveToEnd() }, 20);
		}
	}

	
	function _SetBackMoves()
	{
		// remove the set piece
		var lastPiece = _History[_moves].split(',');
		if(_humanVsHuman)
		{
			_human = _OtherPlayer(_board[lastPiece[0]][lastPiece[1]].player);
		}
		
		// set this place empty
		_score[_board[lastPiece[0]][lastPiece[1]].player]--;
		_SetPieceImage(lastPiece[0], lastPiece[1], _picture[_EMPTY].src);
		//_History[_moves] = '';
		_ShowHistory();
		
		// change the color of the gained pieces
		var discs = _Gains[_moves].split('#');
		_Gains[_moves] = '';
		for(var i=0; i<discs.length; i++)
		{
			var coords = discs[i].split(',');
			if(_humanVsHuman)
			{
				_SetPieceImage(coords[0], coords[1], _picture[_human].src);
				_score[_human]++;
				_board[coords[0]][coords[1]].player = _human;
			}
			else
			{
				_SetPieceImage(coords[0], coords[1], _picture[_turn].src);
				_score[_turn]++;
				_board[coords[0]][coords[1]].player = _turn;
			}
			_score[_board[lastPiece[0]][lastPiece[1]].player]--;
		}
		_board[lastPiece[0]][lastPiece[1]].player = _EMPTY;
		_moves--;
		if(_moves >= 1 && typeof _History[_moves] != 'undefined')
		{
			lastPiece = _History[_moves].split(',');
			_MarkMove(lastPiece[0], lastPiece[1], _human);
		}
		else
		{
			_UnmarkMove(lastPiece[0], lastPiece[1], _human);
			_lastMove.x = -1;
			_lastMove.y = -1;
		}
		_DoneTurn();
		if(!_humanVsHuman && !_AI_timerID)
		{
			_AI_timerID = setTimeout( function() { _SetBackMoves(); }, _human == _EMPTY ? 1000: 150);
		}
		else
		{
			clearTimeout(_AI_timerID);
			_moveBack = false;
		}
	}
	

	function _RawShowFlipCount(x, y, player) {
	    var flips;
	    if(_board[x][y].player != _EMPTY) return false;
	    if((flips = _board[x][y].flips[player]) == 0) return false;
	    _SetPieceImage(x, y, _picture[_NUMBASE + flips].src);
	    return true;
	}

	this.ShowFlipCounts = function(player) {
	    _CalcFlipCounts();
	    for(var y = 0; y < _height; y++) {
	        for(var x = 0; x < _width; x++) {
	            _RawShowFlipCount(x, y, player);
	        }
	    }
	}

	this.HideFlipCounts = function() {
	    for(var y = 0; y < _height; y++) {
	        for(var x = 0; x < _width; x++) {
	            if(_board[x][y].player == _EMPTY)
	                _SetPieceImage(x, y, _picture[_EMPTY].src);
	        }
	    }
	}

	function _OtherPlayer(player) {
	    return player == _WHITE ? _BLACK : _WHITE;
	}

	function _DoneTurn() {
	    if(_turn != _EMPTY && _human != _EMPTY)
		{
			
			if(_humanVsHuman) {
				var hmoves = _AnyMoves(_human);
				_human = _OtherPlayer(_human);
				_ShowScore();
				_ShowMessage((_human == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerTurn);
				if(!_AnyMoves(_human)) {
			        if(!hmoves && !_moveBack)
					{
						if(_score[_BLACK] == _score[_WHITE])
							_ShowMessage(_Draw);
						else
							_ShowMessage((_score[_BLACK] > _score[_WHITE] ? _PlayerBlack : _PlayerWhite) + _PlayerHasWon);
						_ShowHistory();
						return _GameOver();
					}

			        // XXX inform user the player has no move
					_ShowMessage((_human == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerMustPass);
			        // and switch players again
			        _human = _OtherPlayer(_human);
				}
			}
			var moves = _AnyMoves(_turn);
			_turn = _OtherPlayer(_turn);
			_ShowScore();
			_ShowMessage((_human == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerTurn);
			// check whether the new player has any moves
			if(!_AnyMoves(_turn)) {
				if(!moves && !_moveBack) 
				{
					if(_score[_BLACK] == _score[_WHITE])
						_ShowMessage(_Draw);
					else
						_ShowMessage((_score[_BLACK] > _score[_WHITE] ? _PlayerBlack : _PlayerWhite) + _PlayerHasWon);
				}

				// XXX inform user the player has no move
				_ShowMessage((_turn == _BLACK ? _PlayerBlack : _PlayerWhite) + _PlayerMustPass);
				// and switch players again
				_turn = _OtherPlayer(_turn);
			}
			
			// add a slight delay before the computer takes it's turn so game feels
			// "warmer"; when computer is playing itself, add larger delay so user
			// can watch
			if(_turn != _human) {
				_self.HideFlipCounts();
				if(!_humanVsHuman && !_moveBack)
				{
					_AI_timerID = setTimeout( function() { _OthelloAI(_turn); }, _human == _EMPTY ? 1000: 150);
				}
			}
			else if(_showflips)
				_self.ShowFlipCounts(_human);
		}
	}

	function _Rate(x, y, player) {
	    var rating;

	    if(_board[x][y].player != _EMPTY) return 0;
	    if(x < 0 || x >= _width || y < 0 || y >= _height) return 0;

	    rating = _board[x][y].flips[player];

	    if(!_weightsquares)
	        rating = (rating > 0)? 1 : 0;

	    if(_edgesensitive && rating > 0) {
	        // increase all non-zero weightings by 3 so we have room
	        // to wait 'less ideal' squares below the baseline
	        rating += 10;

	        // raise edge ratings 4 points, corners are raised 8
	        if(x == 0 || x == _width - 1) rating += 4;
	        if(y == 0 || y == _height - 1) rating += 4;
	        // lower next-to-edge ratings by 5 points, next-to-corner by 10
	        if(x == 1 || x == _width - 2) rating -= 5;
	        if(y == 1 || y == _height - 2) rating -= 5;

	        // we cannot rule out a move because of bad location; we must
	        // always go somewhere
	        if(rating < 1) rating = 1;
	    }
	    return(rating);
	}

	function _OthelloAI(player) {
	    var x, y;
	    var best = 0, numbest = 0;
	    var rating;
	    var pick, count;

	    // rank each position on the board by the potential flip count
	    _CalcFlipCounts();

	    // apply AI rating algorithm
	    for(y = 0; y < _height; y++) {
	        for(x = 0; x < _width; x++) {
	            rating = _Rate(x, y, player);

	            // store the rating back into the board
	            _board[x][y].value[player] = rating;

	            if(rating == best)
	                numbest++;
	            else if(rating > best) {
	                best = rating;
	                numbest = 1;
	            }
	        }
	    }

	    while(numbest > 0) {
	        // pick a square to put our piece
	        pick = Math.floor(Math.random() * numbest);
	        count = 0;
	        for(y = 0; y < _height; y++) {
	            for(x = 0; x < _width; x++) {
	                rating = _board[x][y].value[player];
	                if(rating == best) {
	                    if(count == pick) {
	                        _FlipPieces(x, y, player);
							_MarkMove(x, y, player);
	                        _DoneTurn();
	                        return;
	                    }
	                    else count++;
	                }
	            }
	        }
	    }

	    // if we make it here, then there was nowhere to go
	    _DoneTurn();
	}

	this.Play = function() {
	    // black always goes first
	    if(_human != _BLACK)
	        _OthelloAI(_BLACK);
	    else if(_showflips)
	        this.ShowFlipCounts(_human);
	}

	function _GameOver() {
	    _turn = _EMPTY;
	}
	
	_initializeGame(options);
}
// End Othelly class


// these global functions will be used in the game: trim(), in_array(), clone()
String.prototype.trim = function()
{
	var	str = this.replace(/^\s\s*/, ''),
		ws = /\s/,
		i = this.length;
	while (ws.test(str.charAt(--i)));
	return str.slice(0, i + 1);
}

Array.prototype.in_array = function(needle, argStrict) {
  // http://phpjs.org/functions/in_array/
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: vlado houba
  // +   input by: Billy
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  var key = '',
    strict = !! argStrict;

  if (strict) {
    for (key in this) {
      if (this[key] === needle) {
        return true;
      }
    }
  } else {
    for (key in this) {
      if (this[key] == needle) {
        return true;
      }
    }
  }

  return false;
}
// http://oranlooney.com/functional-javascript/
// http://stackoverflow.com/questions/3774008/cloning-a-javascript-object
var clone = (function(){ 
  return function (obj) { Clone.prototype=obj; return new Clone() };
  function Clone(){}
}());