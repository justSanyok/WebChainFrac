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

Frac.prototype.setParam = function(_f,_n,_d) {
    this.f = _f;
    this.n = _n;
    this.d = _d;
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
    return new Polynom({coefficients: tV});
};

Polynom.prototype.minus = function(that) {
    var tV = [];
    var i=0;
    var mn = min(this.p.length,that.p.length);
    for (;i<mn;i++) tV[i] = this.p[i]-that.p[i];
    if (this.p.length>that.p.length) {
        for (;i<this.p.length;i++) tV[i]=this.p[i];
    } else {
        for (;i<that.p.length;i++) tV[i]=-that.p[i];
    }
    var swap;
    for (i=0;i<tV.length/2;i++) {
        swap=tV[i];
        tV[i] = tV[tV.length-1-i];
        tV[tV.length-1-i] = swap;
    }
    return new Polynom({coefficients: tV});
};

Polynom.prototype.mult = function(that) {
    var tV = [];
    var l = this.deg+that.deg;
    var i=0;    var j;
    for (;i<l;i++) tV[i] = 0;
    for (i=0;i<this.deg;i++) {
        j=0;
        for (;j<that.deg;j++) {
            tV[i+j] += this.p[i]*that.p[j];
        }
    }
    var swap;
    for (i=0;i<tV.length/2;i++) {
        swap=tV[i];
        tV[i] = tV[tV.length-1-i];
        tV[tV.length-1-i] = swap;
    }
    return new Polynom({coefficients: tV});
};

Polynom.prototype.negative = function() {
    var i = 0;
    for(;i<this.p.length;i++) this.p[i]*=-1;
};

/*===========================================================================================================*/
/*========================================== P O L Y N O M -F R A C =========================================*/
/*===========================================================================================================*/

function PolyFrac(parameters) {
    this.n = parameters.numerator;
    this.d = parameters.denominator;
}

PolyFrac.prototype.toString = function() {
    var s = "("+this.n.toString() + ")/(" + this.d.toString() + ")";
       return s;
};

PolyFrac.prototype.addValueTo = function(value) {
    var tV = [];
    var i = 0;
    for (;i<this.d.deg;i++) tV[this.d.deg-1-i] = this.d.p[i]*value;
    var tP = new Polynom({coefficients: tV});
    this.n = this.n.add(tP);
};

PolyFrac.prototype.converse = function() {
    var tP = this.n;
    this.n = this.d;
    this.d = tP;
};

PolyFrac.prototype.polyToSolve = function() {
    var tP1 = this.d;
    var tP2 = new Polynom({coefficients: [1,0]});
    tP1 = tP1.mult(tP2);
    tP1 = tP1.minus(this.n);
    return tP1;
};

PolyFrac.prototype.returnFrac = function(signum) {
    var tP = this.polyToSolve();
    if (tP.deg==3) {
        var f = tP.p[1]*tP.p[1] - 4*tP.p[0]*tP.p[2];
        var n = -tP.p[1];
        var d = 2*tP.p[2];
        signum = (signum)==(tP.p[2]>0);
        var x = new Frac({radical: 0, term: 0, denominator: 1, coefficient: 1});
        (signum)? x.setParam(f,n,d): x.setParam(f,-n,-d);
        x.simplify();
        return x;
    }
    return frac.ZERO;
};

/*===========================================================================================================*/
/*================================================ C H A I N ================================================*/
/*===========================================================================================================*/
function Chain(parameters) {
    if (parameters.frac === undefined) this.f = new Frac({radical: 0, term: 0, denominator: 0, coefficient: 0});
        else this.f = parameters.frac;
    if (parameters.arrayVariables === undefined) this.v = [];
        else this.v = parameters.arrayVariables;
    var startPeriod = parameters.startPeriod;
    var endPeriod = parameters.endPeriod;
    var p = parameters.isPeriodical;
    /* this.f = frac; 	     	 дріб                                     */
    /* this.v = arrV;	         масив чисел                            */
    this.p = p; 		    /* періодичність (boolean)                  */
	this.sp = startPeriod;	/* номер елемента початку періоду в масиві  */
    this.ep = endPeriod;	/* номер елемента кінця періоду в масиві    */
}

Chain.prototype.convertToChain = function() {
    var w = [];
    var it=0;
    var x = new Frac({radical: 0, term: 0, denominator: 1, coefficient: 1});
    x = this.f;
    var q, b;
    do {
        w[it] = x;
        q = x.toInteger();
        this.v[it++] = q;
        x = x.minusValueToFrac(q);
        if (!x.equalsNumber(0)) x = x.converse();
        b = 0;
        for (;b< w.length;b++) if (x.equals(w[b])) break;
    } while (b==w.length && !x.equalsNumber(0));
    this.p = (b != w.length);
    if (this.p) {
        this.sp = b;
        this.ep = w.length-1;
    }
};

Chain.prototype.converToFrac = function() {
    var e = this.v.length-1;
    if (!this.p && e>0) {
        var x = new Frac({radical: 0, term: this.v[e], denominator: 1, coefficient: 1});
        e--;
        for (;e>=0;e--) {
            x = x.converse();
            x = x.addValueToFrac(this.v[e]);
        }
        this.f = x;
    } else {
        var x = new Polynom({coefficients: [1]});
        var y = new Polynom({coefficients: [1,0]});
        var a = new PolyFrac({numerator: x, denominator: y});
        var e = this.ep;
        for (;e>this.sp;e--) {
            a.addValueTo(this.v[e]);
            a.converse();
        }
        a.addValueTo(this.v[e]);
        e--;
        var fx = new Frac({radical: 0, term: 0, denominator: 1, coefficient: 1});
        fx = a.returnFrac(this.v[e]>0);
        for (;e>=0;e--) {
            fx = fx.converse();
            fx = fx.addValueToFrac(this.v[e]);
        }
        this.f = fx;
    }
};

Chain.prototype.toStringChain = function() {
    if (this.v.length == 0) this.convertToChain();
    var s="[";
    var i = 0;
    for (;i<this.v.length;i++) {
        if (this.p && (i==this.sp)) s+="(";
        s+=this.v[i];
        if (i==0) {s+=";";} else {s+=",";}
    }
    s = s.substring(0, s.length - 1);
    if (this.p) s+= ")";
    s+="]";
    return s;
};

Chain.prototype.toStringFrac = function() {
    if (this.f.d == 0) this.converToFrac();
    return this.f.toString();
};

/*========================================= TESTING FUNCTIONS ==============================================*/
function mainWorkFunction() {
    var fr = new Frac({radical: 3, term: 2, denominator: 2, coefficient: 1});
	var chain = new Chain({frac: fr});
	alert(chain.toString());
}

function testPoly() {
    //*
    var f = new Frac({radical: 7, term: 0, denominator: 1, coefficient: 1});
    var cf = new Chain({frac: f});
    //cf.convertToChain();
    alert(cf.toStringChain());
    alert(cf.toStringFrac());
    //*/

    /*
    var cf = new Chain({arrayVariables: [2,1,1,1,4], startPeriod: 1, endPeriod: 4, isPeriodical: true});
    cf.converToFrac();
    alert(cf.toStringFrac());
    cf.convertToChain();
    alert(cf.toStringChain());
    //*/
}
