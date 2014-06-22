/* Допоміжні функції */
function gcd(a,b) {
	return (b)?gcd(b,a%b):a;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*//////////////////////////////////////========== F R A C ==========/////////////////////////////////////*/
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
 k*(n+sqrt(f))/d
*/

//конструктор
function Frac(parameters) {
    var radical = parameters.radical;
    var term = parameters.term;
    var denominator = parameters.denominator;
    var coefficient = parameters.coefficient;
    this.n = term;      	// доданок
    this.f = radical; 		// підкореневий вираз
	this.d = denominator; 	// знаменник
	this.k = coefficient;	// коефіцієнт
}

//отримання окремих елементів дробу
Frac.prototype.getN = function() {
	return this.n;
};

Frac.prototype.getF = function() {
	return this.f;
};

Frac.prototype.getD = function() {
	return this.d;
};

Frac.prototype.getK = function() {
	return this.k;
};

Frac.prototype.toString = function() {
    return this.k + "*(" + this.n + "+V" + this.f + ")/" + this.d;
};

Frac.prototype.equalsNumber = function(value) {
    return (this.f == 0)&&
           (this.n == value)&&
           (this.d == 1)&&
           (this.k == 1);
};

Frac.prototype.equals = function(that) {
    return (this.f == that.f)&&
           (this.n == that.n)&&
           (this.d == that.d)&&
           (this.k == that.k);
};

// додавання цілого числа до дробу
Frac.prototype.addValueToFrac = function(value) {
	var _f = this.f*this.k*this.k;
    var _n = this.k*this.n + value*this.d;
    if (this.k<0) _n*=-1;
    var kk=1;
    if(this.k<0) kk=-1;
    var tmp = new Frac({radical: _f, term: _n, denominator: this.d, coefficient: kk});
    tmp.simplify();
    return tmp;
};

/* віднімання цілого від дробу */
Frac.prototype.minusValueToFrac = function(value) {
	var _f = this.f*this.k*this.k;
    var _n = this.k*this.n - value*this.d;
    if (this.k<0) _n*=-1;
    var kk=1;
    (this.k<0)?kk=-1:kk=1;
    var tmp = new Frac({radical: _f, term: _n, denominator: this.d, coefficient: kk});
    tmp.simplify();
    return tmp;
};

/* визначення максимального цілого z<frac */
Frac.prototype.toInteger = function() {
	return Math.floor(this.k*(Math.sqrt(this.f)+this.n)/this.d);
};
 
Frac.prototype.isFullSquare =function() {
	return Math.abs(Math.floor(Math.sqrt(this.f))-Math.sqrt(this.f))<1e-8;
};

Frac.prototype.simplify =function() {
	var u;
	var _n;
	if (this.d<0) {this.d*=-1; this.k*=-1;}
/*========================================== if simple frac	*/
    if (this.f==0) {
            _n = this.n*this.k;
            u = gcd(Math.abs(_n),Math.abs(this.d));
            this.n=_n/u;
            this.d/=u;
            this.k=1;
        } else {
/*========================================== radiacal is full square*/
            if (this.isFullSquare()) {
                _n=this.k*(Math.floor(Math.sqrt(this.f))+this.n);
                this.f=0;
                u = gcd(_n,this.d);
                this.n=_n/u;
                this.d/=u;
                this.k=1;
            }
/*========================================== extract from radical*/
            u = Math.sqrt(this.f);
            var result = 1;
			var i = 2;
            for (; i<=u; ++i) {
                if (this.f%(i*i)==0) {
                    result *= i;
                    this.f/=(i*i);
                }
            }
/*========================================= extract from brackets*/
            u = gcd(result, Math.abs(this.n));
            this.k*=u;
            result/=u;
            this.n/=u;
            this.f*=(result*result);
/*========================================= reduce*/
            u = gcd(Math.abs(this.k),Math.abs(this.d));
            this.k/=u;
            this.d/=u;
        }
};

Frac.prototype.converse = function() {
	var new_d = this.k*(this.f-this.n*this.n);
	var tmp = new Frac({radical: this.f, term: -this.n, denominator: new_d, coefficient: this.d});
	tmp.simplify();
	return tmp;
};

/*  попередньо визначені дробові числа */
Frac.ZERO = new Frac({radical: 0, term: 0, denominator: 1, coefficient: 0});
Frac.ONE = new Frac({radical: 0, term: 1, denominator: 1, coefficient: 1});


/*===========================================================================================================*/
/*================================================ C H A I N ================================================*/
/*===========================================================================================================*/
function Chain(parameters) {
    var frac = parameters.frac;
    var arrV = parameters.arrayVariables;
    var arrW = parameters.arrayReminders;
    var startPeriod = parameters.startPeriod;
    var endPeriod = parameters.endPeriod;
    var p = parameters.isPeriodical;
    this.f = frac; 	     	/* дріб                                     */
    this.v = arrV;	        /* масив чисел                              */
    this.w = arrW;	        /* масив залишків                           */
    this.p = p; 		    /* періодичність (boolean)                  */
	this.sp = startPeriod;	/* номер елемента початку періоду в масиві  */
    this.ep = endPeriod;	/* номер елемента кінця періоду в масиві    */
}

Chain.prototype.toString = function() {
    return this.f.toString();
};

function mainWorkFunction() {
    var fr = new Frac({radical: 3, term: 2, denominator: 2, coefficient: 1});
	var chain = new Chain({frac: fr});
	alert(chain.toString());
}
