/* Допоміжні функції */
function gcd(a,b) {
	return (b)?gcd(b,a%b):a;
}

function min(a,b) {
    return (a<b)?a:b;
}

function max(a,b) {
    return (a>b)?a:b;
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
/*============================================== P O L Y N O M ==============================================*/
/*===========================================================================================================*/

function Polynom(parameters) {
    this.p = [];
    var coefficients = parameters.coefficients;
    var i=0;
    var len=coefficients.length;
    for(;i<len;i++) {
        this.p[i] = coefficients[len-i-1];
    }
    this.deg=this.p.length;
    this.simplify();
}

Polynom.prototype.toString = function() {
    var i=this.deg-1;
    var s="";
    for(;i>0;i--) s+=this.p[i] + " ";
    s+=this.p[0];
    return s;
};

Polynom.prototype.deg = function() {
    return this.deg;
};

Polynom.prototype.deleteLeadZero = function() {
    while (this.p[this.deg-1]==0 && this.deg>1) {
        this.deg--;
    }
};

Polynom.prototype.simplify = function() {
    if (this.deg < 2) return;
    var i = this.deg-1;
    var g = Math.abs(this.p[i]); i--;
    for (;i>=0;i--) g = gcd(g,Math.abs(this.p[i]));
    for (i=0;i<this.deg;i++) this.p[i]/=g;
    this.deleteLeadZero();
};

Polynom.prototype.equalTo = function(that) {
    if (this.deg != that.deg) return false;
    var i = 0;
    while (i<this.deg) {
        if (this.p[i] != that.p[i]) return false;
        i++;
    }
    return true;
};

Polynom.prototype.add = function(that) {
    var tV = [];
    var i=0;
    var mn = min(this.p.length,that.p.length);
    for (;i<mn;i++) tV[i] = this.p[i]+that.p[i];
    if (this.p.length>that.p.length) {
        for (;i<this.p.length;i++) tV[i]=this.p[i];
    } else {
        for (;i<that.p.length;i++) tV[i]=that.p[i];
    }
    var swap;
    for (i=0;i<tV.length/2;i++) {
        swap=tV[i];
        tV[i] = tV[tV.length-1-i];
        tV[tV.length-1-i] = swap;
    }
    var tP = new Polynom({coefficients: tV});
    return tP;
};

Polynom.prototype.mult = function(that) {

};

Polynom.prototype.negative = function() {
    var i = 0;
    for(;i<this.p.length;i++) this.p[i]*=-1;
};

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

function testPoly() {
    var P = new Polynom({coefficients: [2,0,6,8]});
    var Q = new Polynom({coefficients: [-2,0,6,8]});
    var T = new Polynom({coefficients: [0]});
    T = P.add(Q);
    //alert(P.toString());
    alert(Q.toString());
    alert(T.toString());
}
