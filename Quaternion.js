//////////////////////////////////////////////////////////////////////////////////////////////////
//============================== Q U A T E R N I O N ===========================================//
//////////////////////////////////////////////////////////////////////////////////////////////////

function Quaternion(Re, I, J, K) {
	this.re=Re;
	this.i=I;
	this.j=J;
	this.k=K;
}

Quaternion.prototype.toString = function() {
	var s;
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

Quaternion.prototype.add = function(term1,term2) {
	return Quaternion(term1.re+term2.re, term1.i+term2.i, term1.j+term2.j, term1.k+term2.k);
}

Quaternion.prototype.mult = function(m1,m2) {
	var re=m1.re*m2.re-m1.i*m2.i-m1.j*m2.j-m1.k*m2.k;
	var im=m1.re*m2.i+m1.i*m2.re+m1.j*m2.k-m1.k*m2.j;
	var jm=m1.re*m2.j-m1.i*m2.k+m1.j*m2.re+m1.k*m2.i;
	var km=m1.re*m2.k+m1.i*m2.j-m1.j*m2.i+m1.k*m2.re;
	return Quaternion(re,im,jm,km);
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function mainWorkFunction2() {
	var q = new Quaternion(3,0,2,1); 
	alert(q.toString());
}
