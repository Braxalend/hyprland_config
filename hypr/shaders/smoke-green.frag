#version 100
precision highp float;
uniform float time; uniform vec2 resolution;
float rand(vec2 n){ return fract(sin(dot(n, vec2(12.9898,4.1414)))*43758.5453); }
float noise(vec2 p){
    vec2 ip=floor(p); vec2 u=fract(p); u=u*u*(3.0-2.0*u);
    return mix(mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
               mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
}
float fbm(vec2 p){ float v=0.0,a=0.5; for(int i=0;i<6;i++){ v+=a*noise(p); p=p*2.0+vec2(1.3,1.7); a*=0.5;} return v; }
float densField(vec2 p, out vec2 flow){
    float t=time*0.10; p.y-=t*1.9;
    vec2 w=vec2(fbm(p+vec2(0.0,t)), fbm(p+vec2(5.2,-t)));
    flow=w-0.5;
    return fbm(p+0.8*w);          // мягкая закрутка = не вода
}
float rowVal(float g,float y){
  if(g<0.5){ if(y<0.5) return 14.0; else if(y<1.5) return 17.0; else if(y<2.5) return 25.0; else if(y<3.5) return 21.0; else if(y<4.5) return 19.0; else if(y<5.5) return 17.0; else return 14.0; }
  else if(g<1.5){ if(y<0.5) return 4.0; else if(y<1.5) return 6.0; else if(y<2.5) return 4.0; else if(y<3.5) return 4.0; else if(y<4.5) return 4.0; else if(y<5.5) return 4.0; else return 14.0; }
  else if(g<2.5){ if(y<0.5) return 14.0; else if(y<1.5) return 17.0; else if(y<2.5) return 16.0; else if(y<3.5) return 12.0; else if(y<4.5) return 2.0; else if(y<5.5) return 1.0; else return 31.0; }
  else if(g<3.5){ if(y<0.5) return 15.0; else if(y<1.5) return 16.0; else if(y<2.5) return 12.0; else if(y<3.5) return 16.0; else if(y<4.5) return 16.0; else if(y<5.5) return 17.0; else return 14.0; }
  else if(g<4.5){ if(y<0.5) return 31.0; else if(y<1.5) return 1.0; else if(y<2.5) return 15.0; else if(y<3.5) return 16.0; else if(y<4.5) return 16.0; else if(y<5.5) return 17.0; else return 14.0; }
  else if(g<5.5){ if(y<0.5) return 31.0; else if(y<1.5) return 16.0; else if(y<2.5) return 8.0; else if(y<3.5) return 4.0; else if(y<4.5) return 2.0; else if(y<5.5) return 2.0; else return 2.0; }
  else if(g<6.5){ if(y<0.5) return 14.0; else if(y<1.5) return 17.0; else if(y<2.5) return 17.0; else if(y<3.5) return 30.0; else if(y<4.5) return 16.0; else if(y<5.5) return 17.0; else return 14.0; }
  else if(g<7.5){ if(y<0.5) return 4.0; else if(y<1.5) return 10.0; else if(y<2.5) return 17.0; else if(y<3.5) return 31.0; else if(y<4.5) return 17.0; else if(y<5.5) return 17.0; else return 17.0; }
  else if(g<8.5){ if(y<0.5) return 31.0; else if(y<1.5) return 1.0; else if(y<2.5) return 15.0; else if(y<3.5) return 1.0; else if(y<4.5) return 1.0; else if(y<5.5) return 1.0; else return 31.0; }
  else if(g<9.5){ if(y<0.5) return 31.0; else if(y<1.5) return 4.0; else if(y<2.5) return 4.0; else if(y<3.5) return 4.0; else if(y<4.5) return 4.0; else if(y<5.5) return 4.0; else return 4.0; }
  else if(g<10.5){ if(y<0.5) return 31.0; else if(y<1.5) return 16.0; else if(y<2.5) return 8.0; else if(y<3.5) return 4.0; else if(y<4.5) return 2.0; else if(y<5.5) return 1.0; else return 31.0; }
  else if(g<11.5){ if(y<0.5) return 17.0; else if(y<1.5) return 9.0; else if(y<2.5) return 3.0; else if(y<3.5) return 5.0; else if(y<4.5) return 9.0; else if(y<5.5) return 17.0; else return 17.0; }
  else if(g<12.5){ if(y<0.5) return 16.0; else if(y<1.5) return 16.0; else if(y<2.5) return 31.0; else if(y<3.5) return 8.0; else if(y<4.5) return 20.0; else if(y<5.5) return 18.0; else return 1.0; }
  else if(g<13.5){ if(y<0.5) return 31.0; else if(y<1.5) return 16.0; else if(y<2.5) return 4.0; else if(y<3.5) return 14.0; else if(y<4.5) return 5.0; else if(y<5.5) return 4.0; else return 8.0; }
  else if(g<14.5){ if(y<0.5) return 31.0; else if(y<1.5) return 0.0; else if(y<2.5) return 31.0; else if(y<3.5) return 0.0; else if(y<4.5) return 31.0; else if(y<5.5) return 0.0; else return 16.0; }
  else if(g<15.5){ if(y<0.5) return 31.0; else if(y<1.5) return 17.0; else if(y<2.5) return 17.0; else if(y<3.5) return 17.0; else if(y<4.5) return 17.0; else if(y<5.5) return 17.0; else return 31.0; }
  return 0.0;
}
float glyphBit(float gid, vec2 cuv){
    float col=floor(cuv.x*5.0), row=floor(cuv.y*7.0);
    if(col<0.0||col>4.0||row<0.0||row>6.0) return 0.0;
    float r=rowVal(gid,row); return mod(floor(r/pow(2.0,col)),2.0);
}
float matrixRain(vec2 uv){
    float CELL=13.0;
    vec2 pix=vec2(uv.x*resolution.x, (1.0-uv.y)*resolution.y);
    vec2 cid=floor(pix/CELL); vec2 cuv=fract(pix/CELL);
    float cn=cid.x;
    float speed=0.35+0.95*rand(vec2(cn,7.0));
    float t=time*speed*7.0;
    float rows=resolution.y/CELL;
    float head=mod(t+70.0*rand(vec2(cn,3.0)), rows+30.0);
    float dist=head-cid.y;
    float trail=(dist>=0.0)?exp(-dist*0.16):0.0;
    float gid=floor(rand(cid+floor(t*0.5))* 16.0 );
    float g=glyphBit(gid, cuv);
    float r=trail*g; if(dist>=0.0 && dist<1.2) r+=g*trail*0.8;
    return r;
}
void main(){
    vec2 uv=gl_FragCoord.xy/resolution.xy;
    float asp=resolution.x/resolution.y;
    vec2 pp=vec2((uv.x-0.5)*asp, uv.y)*3.2;
    float rise=smoothstep(1.35,-0.1,uv.y);
    vec2 flow; float raw=densField(pp, flow);
    float d=raw*(0.55+0.5*rise);
    d=smoothstep(0.40,0.96,d);                 // тоньше, нежнее, больше воздуха
    vec3 base=vec3(0.14,0.66,0.30);            // светлее, легче зелёный
    vec3 hi  =vec3(0.55,1.0,0.68);             // воздушная подсветка кончиков
    vec3 smoke=base*d*0.62 + hi*pow(d,2.3)*0.30;   // низкая непрозрачность = лёгкость
    vec2 ruv=uv+flow*0.08;
    float code=matrixRain(ruv)*smoothstep(0.06,0.40,d);
    vec3 col=smoke + vec3(0.4,1.0,0.6)*code*0.22;
    gl_FragColor=vec4(col,1.0);
}