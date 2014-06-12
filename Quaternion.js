//////////////////////////////////////////////////////////////////////////////////////////////////
//============================== Q U A T E R N I O N ===========================================//
//////////////////////////////////////////////////////////////////////////////////////////////////

function Quaternion(Re=0, I=0, J=0, K=0) {
	this.re=Re;
	this.i=I;
	this.j=J;
	this.k=K;
}

Quaternion.prototype.toString = function() {
	var s;
	if (this.re==0 && this.i==0 && this.j==0 && this.k==0) return 0;
	if (this.re) s=this.re;
	if (this.i>0) s+="+"+this.i+"i";
	if (this.i<0) s+=this.i+"i";
	if (this.j>0) s+="+"+this.j+"j";
	if (this.j<0) s+=this.j+"j";
	if (this.k>0) s+="+"+this.k+"i";
	if (this.k<0) s+=this.k+"i";
	return s; 
}

Quaternion.prototype.addTo = function(term)  {
	this.re+=term.re;
	this.i+=term.i;
	this.j+=term.j;
	this.k+=term.k;
}

Quaternion.prototype.add = function(term2,result) {
	result.re = this.re+term2.re;
	result.i = this.re+term2.i;
	result.j = this.re+term2.j;
	result.k = this.re+term2.k;
}

Quaternion.prototype.mult = function(m2,mr) {
	mr.re=this.re*m2.re-this.i*m2.i-this.j*m2.j-this.k*m2.k;
	mr.i=this.re*m2.i+this.i*m2.re+this.j*m2.k-this.k*m2.j;
	mr.j=this.re*m2.j-this.i*m2.k+this.j*m2.re+this.k*m2.i;
	mr.k=this.re*m2.k+this.i*m2.j-this.j*m2.i+this.k*m2.re;
}

Quaternion.prototype.norma = function() {
	return this.re*this.re+this.i*this.i+this.j*this.j+this.k*this.k;
}

Quaternion.prototype.converse = function() {
	var n = this.norma();
	this.re/=n;
	this.i/=-n;
	this.j/=-n;
	this.k/=-n;
}

Quaternion.prototype.division = function(denominator,left,right) {
	denominator.converse();
	this.mult(denominator,left);
	denominator.mult(this,right);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function mainWorkFunction2() {
	var q1 = new Quaternion(1,1,1,0); 
	var q2 = new Quaternion(1,1,0,0); 
	var l = new Quaternion();
	alert(l.toString());
	var r = new Quaternion();
	q1.division(q2,l,r);
	alert(l.toString());
	alert(r.toString());
}
