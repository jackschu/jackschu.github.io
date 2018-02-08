Mathx = {
	distance: function(point1, point2){ //for virtual points, not those used in threejs
		//ex. distance({x: 5, y: 3}, {x:1, y:8});
		var d = Math.pow(point1.x - point2.x, 2) + Math.pow(point1.y - point2.y, 2); //keep distance as number inside radical, for passing to simpleRad
		return Mathx.simpleRad(d);
	},

	simpleRad: function(radical){ //simplifies a radical, for example, input 50 will return 5 and 2 -> 5 sqrt(2)
		var numAndRad = {
			coefficient: undefined,
			radical: undefined
		};

		// var square = decimal*decimal; // 4
		var factors = Mathx.factor(radical); //1, 4, 2
		var squares = Mathx.squareFactor(factors); //1, 4
		var maxSquare = Mathx.max(squares); //4

		numAndRad.coefficient = Math.sqrt(maxSquare); //4
		if (numAndRad.coefficient==1 && numAndRad.radical != 1){
			numAndRad.coefficient = '\0';
		}

		numAndRad.radical = radical/maxSquare;

		return numAndRad;
		
	},

	factor: function(num){ //finds all the factors of a number 
		var factors = [];
		for(var i = 1; i <= Math.sqrt(num); i++){
			if (num % i == 0){
				factors.push(i);
				if (i != Math.sqrt(num)){
					factors.push(num/i);
				}
			}
		}
		return factors;
	}, 

	squareFactor: function(numbers){ //returns all the numbers that are squares
		var results = [];
		for (var i = 0; i < numbers.length; i++){
			if (Math.sqrt(numbers[i]) % 1 == 0){ //if whole number
				results.push(numbers[i]);
			}
		}
		return results;
	}, 

	max: function(a){ //max in array
		var max = 0;
		for (var i = 0; i < a.length; i++){
			if (a[i] > max){
				max = a[i];
			}
		}
		return max;
	},

	antiRad: function(numAndRad){
		if (numAndRad.coefficient == '\0'){
			numAndRad.coefficient = 1;
		}
		var x = numAndRad.coefficient*numAndRad.coefficient * numAndRad.radical;
		return x;
	},

	slope: function(point1, point2){
		var slope = {
			numerator: point1.y - point2.y,
			denominator: point1.x - point2.x,
			value: undefined
		}
		slope.value = slope.numerator/slope.denominator;
		if(slope.numerator % slope.denominator == 0){
			slope.numerator =  slope.numerator / slope.denominator;
			slope.denominator = 1;
		}else if(slope.denominator % slope.numerator == 0){
			slope.denominator =  slope.denominator / slope.numerator;
			slope.numerator = 1;
		}
		return slope;
	},

	findLimits: function(inverseSlope, point1, point2){ //finds the possible range of the multiplier for the area problem
		var solutions = []; //becomes 2D array - first dimension is solution number; second dimension is the coordinates comprising the solution
		var isI = true;
		
		//checks positively shifted points to be in bounds
		//console.log( "we got here");
		for (var i = 0; isI == true; i++){
			// console.log( Math.abs(point1.x + inverseSlope.denominator * (i + 1)) <= 5 );
			// console.log( Math.abs(point1.y + inverseSlope.numerator * (i + 1)) <= 5 );
			// console.log( Math.abs(point2.x + inverseSlope.denominator * (i + 1)) <= 5 );
			// console.log( Math.abs(point2.y + inverseSlope.numerator * (i + 1)) <= 5);
			if(Math.abs(point1.x + inverseSlope.denominator * (i + 1)) <= 5 && Math.abs(point1.y + inverseSlope.numerator * (i + 1)) <= 5 && Math.abs(point2.x + inverseSlope.denominator * (i + 1)) <= 5 && Math.abs(point2.y + inverseSlope.numerator * (i + 1)) <= 5){
				//console.log( "W E W I N B O Y S");
				//solutions[i][0] = point1.x;
				solutions[i] = [point1.x + inverseSlope.denominator * (i + 1), -1 * ( point1.y + inverseSlope.numerator * (i + 1)), point2.x + inverseSlope.denominator * (i + 1), -1 *(point2.y + inverseSlope.numerator * (i + 1))];
				
			} else {
				isI = false;
			}
			
		}
		
		isI = true;
		
		//checks negatively shifted points to be in bounds
		for (var j = 0; isI == true; j++){
			// console.log( Math.abs(point1.x - inverseSlope.denominator * (j + 1)) <= 5 );
			// console.log( Math.abs(point1.y - inverseSlope.numerator * (j + 1)) <= 5 );
			// console.log( Math.abs(point2.x - inverseSlope.denominator * (j + 1)) <= 5 );
			// console.log( Math.abs(point2.y - inverseSlope.numerator * (j + 1)) <= 5);
			if(Math.abs(point1.x - inverseSlope.denominator * (j + 1)) <= 5 && Math.abs(point1.y - inverseSlope.numerator * (j + 1)) <= 5 && Math.abs(point2.x - inverseSlope.denominator * (j + 1)) <= 5 && Math.abs(point2.y - inverseSlope.numerator * (j + 1)) <= 5){
				//checks positively shifted points to be in bounds
				// console.log( "W E W I N B O Y S");
				solutions[i + j - 1] = [point1.x - inverseSlope.denominator * (j + 1), -1 * (point1.y - inverseSlope.numerator * (j + 1)), point2.x - inverseSlope.denominator * (j + 1), -1 * (point2.y - inverseSlope.numerator * (j + 1))];
			} else {
				isI = false;
			}
			
		}

		return solutions;
	},

	getRandomInt: function (min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

}