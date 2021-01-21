// FOSSIL DELTA LIBRARY
!function(t,r){"undefined"!=typeof module&&module.exports?module.exports=r():t.fossilDelta=r()}(this,function(){"use strict";function t(){this.a=0,this.b=0,this.i=0,this.z=new Array(a)}function r(t){this.a=t,this.pos=0}function e(){this.a=[]}function n(t){var r,e;for(r=1,e=64;t>=e;r++,e<<=6);return r}function o(t){for(var r=0,e=0,n=0,o=0,i=0,a=t.length;a>=16;)r=r+t[i+0]|0,e=e+t[i+1]|0,n=n+t[i+2]|0,o=o+t[i+3]|0,r=r+t[i+4]|0,e=e+t[i+5]|0,n=n+t[i+6]|0,o=o+t[i+7]|0,r=r+t[i+8]|0,e=e+t[i+9]|0,n=n+t[i+10]|0,o=o+t[i+11]|0,r=r+t[i+12]|0,e=e+t[i+13]|0,n=n+t[i+14]|0,o=o+t[i+15]|0,i+=16,a-=16;for(;a>=4;)r=r+t[i+0]|0,e=e+t[i+1]|0,n=n+t[i+2]|0,o=o+t[i+3]|0,i+=4,a-=4;switch(o=((o+(n<<8)|0)+(e<<16)|0)+(r<<24)|0,a){case 3:o=o+(t[i+2]<<8)|0;case 2:o=o+(t[i+1]<<16)|0;case 1:o=o+(t[i+0]<<24)|0}return o>>>0}var i={},a=16;t.prototype.init=function(t,r){var e,n,o=0,i=0;for(e=0;e<a;e++)n=t[r+e],o=o+n&65535,i=i+(a-e)*n&65535,this.z[e]=n;this.a=65535&o,this.b=65535&i,this.i=0},t.prototype.next=function(t){var r=this.z[this.i];this.z[this.i]=t,this.i=this.i+1&a-1,this.a=this.a-r+t&65535,this.b=this.b-a*r+this.a&65535},t.prototype.value=function(){return(65535&this.a|(65535&this.b)<<16)>>>0};var h="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz~".split("").map(function(t){return t.charCodeAt(0)}),u=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,2,3,4,5,6,7,8,9,-1,-1,-1,-1,-1,-1,-1,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,-1,-1,-1,-1,36,-1,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,-1,-1,-1,63,-1];return r.prototype.haveBytes=function(){return this.pos<this.a.length},r.prototype.getByte=function(){var t=this.a[this.pos];if(++this.pos>this.a.length)throw new RangeError("out of bounds");return t},r.prototype.getChar=function(){return String.fromCharCode(this.getByte())},r.prototype.getInt=function(){for(var t,r=0;this.haveBytes()&&(t=u[127&this.getByte()])>=0;)r=(r<<6)+t;return this.pos--,r>>>0},e.prototype.toArray=function(){return this.a},e.prototype.putByte=function(t){this.a.push(255&t)},e.prototype.putChar=function(t){this.putByte(t.charCodeAt(0))},e.prototype.putInt=function(t){var r,e,n=[];if(0===t)return void this.putChar("0");for(r=0;t>0;r++,t>>>=6)n.push(h[63&t]);for(e=r-1;e>=0;e--)this.putByte(n[e])},e.prototype.putArray=function(t,r,e){for(var n=r;n<e;n++)this.a.push(t[n])},i.create=function(r,i){var h,u=new e,s=i.length,p=r.length,f=-1;if(u.putInt(s),u.putChar("\n"),p<=a)return u.putInt(s),u.putChar(":"),u.putArray(i,0,s),u.putInt(o(i)),u.putChar(";"),u.toArray();var c=Math.ceil(p/a),y=new Array(c),w=new Array(c);for(h=0;h<y.length;h++)y[h]=-1;for(h=0;h<w.length;h++)w[h]=-1;var d,v=new t;for(h=0;h<p-a;h+=a)v.init(r,h),d=v.value()%c,y[h/a]=w[d],w[d]=h/a;for(var g,l,C,m,A,I=0;I+a<s;)for(m=0,A=0,v.init(i,I),h=0,C=0;;){var b=250;for(d=v.value()%c,l=w[d];l>=0&&b-- >0;){var E,z,B,k,x,S,D,M;for(g=l*a,k=0,S=g,D=I+h;S<p&&D<s&&r[S]===i[D];k++,S++,D++);for(k--,x=1;x<g&&x<=h&&r[g-x]===i[I+h-x];x++);x--,z=g-x,E=k+x+1,B=h-x,M=n(h-x)+n(E)+n(z)+3,E>=M&&E>C&&(C=E,m=g-x,A=B),l=y[l]}if(C>0){A>0&&(u.putInt(A),u.putChar(":"),u.putArray(i,I,I+A),I+=A),I+=C,u.putInt(C),u.putChar("@"),u.putInt(m),u.putChar(","),m+C-1>f&&(f=m+C-1),C=0;break}if(I+h+a>=s){u.putInt(s-I),u.putChar(":"),u.putArray(i,I,I+s-I),I=s;break}v.next(i[I+h+a]),h++}return I<s&&(u.putInt(s-I),u.putChar(":"),u.putArray(i,I,I+s-I)),u.putInt(o(i)),u.putChar(";"),u.toArray()},i.outputSize=function(t){var e=new r(t),n=e.getInt();if("\n"!==e.getChar())throw new Error("size integer not terminated by '\\n'");return n},i.apply=function(t,n,i){var a,h=0,u=new r(n),s=t.length,p=n.length;if(a=u.getInt(),"\n"!==u.getChar())throw new Error("size integer not terminated by '\\n'");for(var f=new e;u.haveBytes();){var c,y;switch(c=u.getInt(),u.getChar()){case"@":if(y=u.getInt(),u.haveBytes()&&","!==u.getChar())throw new Error("copy command not terminated by ','");if((h+=c)>a)throw new Error("copy exceeds output file size");if(y+c>s)throw new Error("copy extends past end of input");f.putArray(t,y,y+c);break;case":":if((h+=c)>a)throw new Error("insert command gives an output larger than predicted");if(c>p)throw new Error("insert count exceeds size of delta");f.putArray(u.a,u.pos,u.pos+c),u.pos+=c;break;case";":var w=f.toArray();if((!i||!1!==i.verifyChecksum)&&c!==o(w))throw new Error("bad checksum");if(h!==a)throw new Error("generated size does not match predicted size");return w;default:throw new Error("unknown delta operator")}}throw new Error("unterminated delta")},i});
const fossilDelta = module.exports;

const fs = require('fs').promises;

const patchesBase = "data/deltas";
const target = "temp";

async function recursivelyApplyPatch(path) {
    let files = await fs.readdir(patchesBase + path);
    for (let file of files) {
        let fqPath = patchesBase + path + file;
        let stats = await fs.lstat(fqPath);

        if (stats.isDirectory()) {
            await recursivelyApplyPatch(path + file + "/");
        } else {
            let patch = await fs.readFile(fqPath);
            let orig = await fs.readFile(target + path + file);
            let result;
            console.log("Applying patch to " + target + path + file);
            try {
                result = Buffer.from(fossilDelta.apply(orig, patch));
            } catch(e) {
                console.error("Failed to apply patch! Perhaps the game was updated or you modified it?");
                process.exit(1);
                return;
            }

            await fs.writeFile(target + path + file, result);
        }
    }
}

recursivelyApplyPatch("/");