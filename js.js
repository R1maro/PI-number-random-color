const body=document.getElementsByTagName("body").item(0);
body.style.background="#000";
const TP=2*Math.PI;
const CSIZE=400;

const ctx=(()=>{
    let d=document.createElement("div");
    d.style.textAlign="center";
    body.append(d);
    let c=document.createElement("canvas");
    c.width=2*CSIZE;
    c.height=2*CSIZE;
    d.append(c);
    return c.getContext("2d");
})();
ctx.translate(CSIZE,CSIZE);

onresize=()=>{
    let D=Math.min(window.innerWidth,window.innerHeight)-40;
    ctx.canvas.style.width=ctx.canvas.style.height=D+"px";
}

const getRandomInt=(min,max,low)=>{
    if (low) {
        return Math.floor(Math.random()*Math.random()*(max-min))+min;
    } else {
        return Math.floor(Math.random()*(max-min))+min;
    }
}

var colors=[];
var hues=[];
var setColors=()=>{
    let colorCount=2;
    let h=getRandomInt(180,270);
    for (let i=0; i<colorCount; i++) {
        let hd=Math.round(60/colorCount)*i+getRandomInt(-10,10);
        let hue=(h+hd)%360;
        hues.push(hue);
    }
    for (let i=0; i<colorCount; i++) colors[i]="hsl("+hues[i]+",98%,50%)";
}
setColors();

function start() {
    if (stopped) {
        requestAnimationFrame(animate);
        stopped=false;
    } else {
        stopped=true;
    }
}
ctx.canvas.addEventListener("click", start, false);

var stopped=true;
var t=0;
function animate(ts) {
    if (stopped) return;
    if (++t%7==0) {
        for (let i=0; i<hues.length; i++) {
            hues[i]=++hues[i]%360;
            colors[i]="hsl("+hues[i]+",98%,60%)";
        }
    }
    if (t<dur/4) draw();
    if (t>dur/4+120) ctx.canvas.style.opacity=1-(t-dur/4-120)/60;
    if (t>dur/4+180) {
        reset();
        t=0;
        ctx.clearRect(-CSIZE,-CSIZE,2*CSIZE,2*CSIZE);
        ctx.canvas.style.opacity=1;
    }
    requestAnimationFrame(animate);
}

onresize();

var clip=new Path2D();
clip.arc(0,0,390,0,TP);
ctx.clip(clip);

var dur=1000;
var A=600;
var K1=2;//TP*Math.random();
var seg=92;
var Z=160;
var KZ=100+800*Math.random();
var mot=1;
var motZ=60;
var d=4;

var draw=()=>{
    let a0=-TP*Math.pow(Math.sin(K1+(t+d)/A),2);
    let a=-TP*Math.pow(Math.sin(K1+t/A),2);
    let r1b=CSIZE*Math.pow(Math.sin(TP*(t+d)/dur),2);
    let r1=CSIZE*Math.pow(Math.sin(TP*t/dur),2);
    let K=mot*Math.cos(t/motZ);
    let K0=mot*Math.cos((t+d)/motZ);
    let z0=K0*((t+d)/Z)%TP;
    let z=K*(t/Z)%TP;
    let path0=new Path2D();
    path0.ellipse(0,0,r1b,CSIZE,a0,z0,z0+TP);
    ctx.setLineDash([]);
    ctx.lineWidth=8;
    ctx.strokeStyle="black";
    ctx.stroke(path0);
    let path=new Path2D();
    path.ellipse(0,0,r1,CSIZE,a,z,z+TP);
    let len=TP/2*(3*(r1+CSIZE)-Math.pow((3*r1+CSIZE)*(r1+3*CSIZE),0.5));
    ctx.setLineDash([len/seg,3*len/seg]);
    ctx.lineWidth=5;
    ctx.strokeStyle=colors[0];
    ctx.lineDashOffset=0;
    ctx.stroke(path);
    ctx.strokeStyle=colors[1];
    ctx.lineDashOffset=2*len/seg;
    ctx.stroke(path);
    ctx.setLineDash([len/seg,len/seg]);
    ctx.strokeStyle="black";
    ctx.lineDashOffset=len/seg;
    ctx.stroke(path);
}

var reset=()=>{
    dur=800+4*getRandomInt(0,1600);
    A=(400+800*Math.random())*[-1,1][getRandomInt(0,2)];
    seg=40+4*getRandomInt(0,20);
    K1=TP*Math.random();
    Z=100+400*Math.random();
    motZ=(40+200*Math.random())*[-1,1][getRandomInt(0,2)];
    setColors();
    mot=Math.random();
}

start();