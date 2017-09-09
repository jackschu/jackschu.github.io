OTHELLY is a replayer for Othello- / Reversi games and can also
be used to display game states

Copyright (C) Jürgen Müller-Lütken 10/2013; <kontakt@p-six.de>
All rights reserved.

OTHELLY is based on the Javascript Othello Game of Kelly Yancey (see next paragraph)
It shall be used under the same conditions

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


OTHELLY could be used as a replayer or/and as a displayer of game states.

Include the JS- and the CSS-file (othelly-class.js, othelly.css) into the head of your HTML page
and code the board/s in one of the following ways:

1. VERSION (for replays; with a transkript of a game; whitespace and uppercase are not necessary)

<div class="othello-game">
	<input type="text" class="gameplay" value="F5 D6 C3 D3 C4 F4 F6 G5 E6 D7 E3 C5 F3 E7 H5 E2 C6 D2 C2 G3 F1 E1 D1 G4 F7 H4 H3 C1 B1 B6 H6 B5 E8 D8 C8 G6 B4 A3 C7 F8 G8 F2 A6 G7 A5 A4 A2 B3 H8 H7 G1 G2 B2 A1 H1 B8 A8 H2 B7 A7" />
</div>
<p class="othello-game-title">Black to play</p>

OR

<div class="othello-game">
	<pre class="othello-board-code">
		47 46 17 23 26 24 27 49
		57 58 09 14 22 29 48 50
		42 08 03 04 15 19 35 36
		41 12 05 () ## 06 34 51
		44 13 07 ## () 01 37 40
		16 18 11 02 10 20 28 39
		45 38 32 30 25 21 59 54
		43 56 33 31 52 53 60 55
	</pre>
	<input type="text" class="gameplay" value="" />
</div>
<p class="othello-game-title">Black to play</p>

2. VERSION (for displaying game states. The last two examples in this section are the same as for replays; the only difference is that you have to add the number of the move at the end of the transcript, after which you want to show the game):

<div class="othello-game">
	<pre class="othello-board-code">
		..OOOO..
		#.O#OO..
		##OOOOOO
		#O###OOO
		.OO#OOOO
		OOOOOOOO
		..#OOO..
		.###.O..
	</pre>
	<input type="text" class="gameplay" value="b1a1a5b2g1g2b7a8a7e8h1h2h7g7g8h8" />
</div>
<p class="othello-game-title">Some title</p>

OR

<div class="othello-game">
	<pre class="othello-board-code">
		- - - - - - - -
		- X - - - - - -
		- - X O O - - -
		- - - X O - - -
		- - - O X - - -
		- - O - - X - -
		- - - - - - - -
		- - - - - - - -
	</pre>
	<input type="text" class="gameplay" value="" />
</div>
<p class="othello-game-title">Some title</p>

OR

<div class="othello-game">
	<input type="text" class="gameplay" value="F5 D6 C3 D3 C4 F4 F6 G5 E6 D7 E3 C5 F3 E7 H5 E2 C6 D2 C2 G3 F1 E1 D1 G4 F7 H4 H3 C1 B1 B6 H6 B5 E8 D8 C8 G6 B4 A3 C7 F8 G8 F2 A6 G7 A5 A4 A2 B3 H8 H7 G1 G2 B2 A1 H1 B8 A8 H2 B7 A7 > 4" />
</div>
<p class="othello-game-title">Black to play</p>

OR

<div class="othello-game">
	<pre class="othello-board-code">
		47 46 17 23 26 24 27 49
		57 58 09 14 22 29 48 50
		42 08 03 04 15 19 35 36
		41 12 05 () ## 06 34 51
		44 13 07 ## () 01 37 40
		16 18 11 02 10 20 28 39
		45 38 32 30 25 21 59 54
		43 56 33 31 52 53 60 55
		> 22
	</pre>
	<input type="text" class="gameplay" value="" />
</div>
<p class="othello-game-title">Black to play</p>

