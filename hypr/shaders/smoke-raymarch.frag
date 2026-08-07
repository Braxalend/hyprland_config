#version 100
precision highp float;
uniform float time;
uniform vec2 resolution;
float hash(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
float noise(vec3 x){
    vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);
    return mix(mix(mix(hash(i+vec3(0.,0.,0.)),hash(i+vec3(1.,0.,0.)),f.x),
                   mix(hash(i+vec3(0.,1.,0.)),hash(i+vec3(1.,1.,0.)),f.x),f.y),
               mix(mix(hash(i+vec3(0.,0.,1.)),hash(i+vec3(1.,0.,1.)),f.x),
                   mix(hash(i+vec3(0.,1.,1.)),hash(i+vec3(1.,1.,1.)),f.x),f.y),f.z);
}
float fbm(vec3 p){ float v=0.0,a=0.5; for(int i=0;i<4;i++){ v+=a*noise(p); p=p*2.03; a*=0.5; } return v; }
float dens(vec3 p){ p.y -= time*0.35; return fbm(p*1.2); }
void main(){
    vec2 uv=(gl_FragCoord.xy-0.5*resolution.xy)/resolution.y;
    vec3 ro=vec3(0.0,0.0,-2.5);
    vec3 rd=normalize(vec3(uv,1.2));
    float acc=0.0; vec3 col=vec3(0.0); float tt=1.4;
    for(int i=0;i<32;i++){
        vec3 pos=ro+rd*tt;
        float dn=dens(pos);
        float m=smoothstep(0.55,0.92,dn);
        float plume=smoothstep(1.3,0.0,length(pos.xz))*smoothstep(1.6,-1.1,pos.y);
        float dd=m*plume;
        float a=dd*0.4*(1.0-acc);
        col+=vec3(0.2,1.0,0.13)*a*(0.55+0.45*dn);
        acc+=a; tt+=0.12;
        if(acc>0.95) break;
    }
    gl_FragColor=vec4(col,1.0);
}
