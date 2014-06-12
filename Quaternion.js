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
	return s; 
}

//////////////////////////////////////////////////////////////////////////////////////////////////
function mainWorkFunction2() {
	var q = new Quaternion(3,0,2,1); 
	alert(q.toString());
}