import{g as J,S as $}from"./gsap-Bx3f3KaQ.js";import{L as Ft}from"./lenis-CJLjYWfl.js";import{C as y,V as A,a as Ie,W as At,A as Dt,S as Pt,b as Ot,F as _t,P as Ht,E as Wt,R as Rt,U as Bt,c as Gt,O as Ut,d as jt,e as N,B as Nt,M as K,f as Me,g as R,h as j,i as Ye,G as Q,j as we,I as $t,k as Pe,N as qt,D as gt,l as Vt,L as wt,m as Kt,n as yt,o as xt,p as bt,q as he,r as It,s as Yt,t as Xt,T as ot,u as Zt,v as Oe,w as at,x as Jt}from"./three-DFVUYfD5.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))a(n);new MutationObserver(n=>{for(const i of n)if(i.type==="childList")for(const r of i.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(n){const i={};return n.integrity&&(i.integrity=n.integrity),n.referrerPolicy&&(i.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?i.credentials="include":n.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(n){if(n.ep)return;n.ep=!0;const i=t(n);fetch(n.href,i)}})();function Qt(){try{const o=document.createElement("canvas"),e=o.getContext("webgl2")||o.getContext("webgl");if(!e)return!1;const t=e.getExtension("WEBGL_debug_renderer_info");if(t){const a=String(e.getParameter(t.UNMASKED_RENDERER_WEBGL)||"").toLowerCase();if(a.includes("swiftshader")||a.includes("llvmpipe")||a.includes("software"))return!1}return!0}catch{return!1}}function eo(){const o=matchMedia("(hover: none), (pointer: coarse)").matches,e=Math.min(innerWidth,innerHeight)<620,t=navigator.hardwareConcurrency||4,a=navigator.deviceMemory||4;return o||e?1:t<=4||a<=4?2:3}const Ee=matchMedia("(prefers-reduced-motion: reduce)"),b={webgl:Qt(),reduced:Ee.matches,touch:matchMedia("(hover: none), (pointer: coarse)").matches,tier:eo(),dpr:1,get toriiCount(){return this.tier>=3?42e3:this.tier===2?22e3:9e3},get seaSegments(){return this.tier>=3?200:this.tier===2?128:72},get dustCount(){return this.tier>=3?2600:this.tier===2?1500:700},get bloom(){return this.tier>=2},get grade(){return this.tier>=2},get shadows(){return!1},get maxDpr(){return this.tier>=3?1.75:this.tier===2?1.5:1.25}};b.dpr=Math.min(devicePixelRatio||1,b.maxDpr);function to(){return b.tier<=1?!1:(b.tier-=1,b.dpr=Math.min(devicePixelRatio||1,b.maxDpr),!0)}function oo(o){const e=t=>{b.reduced=t.matches,o(t.matches)};Ee.addEventListener?Ee.addEventListener("change",e):Ee.addListener(e)}const ue=[];let Xe=0,qe=0,nt=0,Ve=!1,Ke=16.7;const ao={get fps(){return 1e3/Ke}};function St(o){Xe=requestAnimationFrame(St);let e=(o-qe)/1e3;if(qe=o,e>.1&&(e=.1),!(e<=0)){nt+=e,Ke+=(e*1e3-Ke)*.06;for(let t=0;t<ue.length;t++)ue[t].fn(e,nt)}}function Ct(){Ve||(Ve=!0,qe=performance.now(),Xe=requestAnimationFrame(St))}function no(){Ve=!1,cancelAnimationFrame(Xe)}function fe(o,e=0){return ue.push({fn:o,order:e}),ue.sort((t,a)=>t.order-a.order),()=>io(o)}function io(o){const e=ue.findIndex(t=>t.fn===o);e>-1&&ue.splice(e,1)}document.addEventListener("visibilitychange",()=>{document.hidden?no():Ct()});const Y=(o,e=0,t=1)=>o<e?e:o>t?t:o,ro=(o,e,t)=>o+(e-o)*t,Tt=(o,e,t)=>e===o?0:(t-o)/(e-o),D=(o,e,t,a)=>ro(o,e,1-Math.exp(-t*a)),ne=(o,e,t)=>{const a=Y(Tt(o,e,t));return a*a*(3-2*a)},ie=(o,e,t,a,n)=>{const i=n*n,r=i*n;return .5*(2*e+(-o+t)*n+(2*o-5*e+4*t-a)*i+(-o+3*e-3*t+a)*r)};function Le(o){let e=o>>>0;return function(){e=e+1831565813>>>0;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function so(o){let e,t,a,n;do e=o()*2-1,t=o()*2-1,a=o()*2-1,n=e*e+t*t+a*a;while(n>1||n===0);return[e,t,a]}const _=(o,e=document)=>e.querySelector(o),q=(o,e=document)=>Array.from(e.querySelectorAll(o)),ce=o=>new Promise(e=>setTimeout(e,o)),w={x:0,y:0,sx:0,sy:0,px:innerWidth/2,py:innerHeight/2,speed:0,down:!1,dragging:!1,dx:0,dy:0,inside:!1};let _e=0,He=0,it=0,rt=0,We=0,Re=0;function st(o){w.px=o.clientX,w.py=o.clientY,w.x=o.clientX/innerWidth*2-1,w.y=-(o.clientY/innerHeight*2-1),w.inside=!0}function lo(){addEventListener("pointermove",e=>{st(e),w.down&&(We+=w.x-_e,Re+=w.y-He,!w.dragging&&Math.hypot(e.clientX-it,e.clientY-rt)>5&&(w.dragging=!0)),_e=w.x,He=w.y},{passive:!0}),addEventListener("pointerdown",e=>{st(e),_e=w.x,He=w.y,it=e.clientX,rt=e.clientY,w.down=!0},{passive:!0});const o=()=>{w.down=!1,requestAnimationFrame(()=>{w.dragging=!1})};addEventListener("pointerup",o,{passive:!0}),addEventListener("pointercancel",o,{passive:!0}),addEventListener("blur",o),document.addEventListener("pointerleave",()=>{w.inside=!1}),fe(e=>{const a=D(w.sx,w.inside?w.x:0,7.5,e),n=D(w.sy,w.inside?w.y:0,7.5,e);w.speed=Math.hypot(a-w.sx,n-w.sy)/e,w.sx=a,w.sy=n,w.dx=We,w.dy=Re,We=0,Re=0},-20)}const S={y:0,max:1,p:0,v:0,energy:0,dir:1},ye=[];let V=null,Be=0;function xe(){S.max=Math.max(1,document.documentElement.scrollHeight-innerHeight),ye.length=0,document.querySelectorAll("[data-scene]").forEach(o=>{const e=o.getBoundingClientRect(),t=e.top+S.y;ye.push({id:o.dataset.scene,el:o,top:t,height:e.height,start:Y(t/S.max),end:Y((t+e.height)/S.max)})})}function Ze(o){const e=ye.find(t=>t.id===o);return e?Y(Tt(e.start,e.end,S.p)):0}function lt(){return V}function co(o,e={}){if(V)V.scrollTo(o,{duration:1.35,...e});else{const t=typeof o=="string"?document.querySelector(o):o;t&&t.scrollIntoView({behavior:"auto",block:"start"})}}function uo(o){b.reduced||(V=new Ft({duration:1.05,easing:a=>Math.min(1,1.001-Math.pow(2,-10*a)),smoothWheel:!0,wheelMultiplier:.95,touchMultiplier:1.6,syncTouch:!1,autoResize:!0})),S.y=window.scrollY||0,Be=S.y,xe(),fe(a=>{V&&V.raf(performance.now());const n=V?V.scroll:window.scrollY||0,i=(n-Be)/a;Be=n,S.y=n,S.p=Y(n/S.max),S.v+=(i-S.v)*Math.min(1,a*9),Math.abs(i)>4&&(S.dir=i>0?1:-1);const r=Y(Math.abs(S.v)/2600);S.energy+=(r-S.energy)*Math.min(1,a*6),o&&o(S)},-10);let e=0;const t=()=>{clearTimeout(e),e=setTimeout(xe,140)};return addEventListener("resize",t),addEventListener("orientationchange",t),document.fonts&&document.fonts.ready&&document.fonts.ready.then(t),"ResizeObserver"in window&&new ResizeObserver(t).observe(document.body),V}function fo(){V?V.stop():document.body.classList.add("is-locked")}function po(){V?V.start():document.body.classList.remove("is-locked")}const T={void:new y("#0b0e23"),voidDeep:new y("#06081a"),ai:new y("#21356b"),aiSoft:new y("#374d8f"),bone:new y("#e8e4da"),boneWarm:new y("#f6e7d2"),shu:new y("#ff4d2e"),shuLift:new y("#ff7a5c"),shuDeep:new y("#c2331a"),cool:new y("#7f92d4"),green:new y("#4ade80")},ee=.0068,vo={name:"KumoGrade",uniforms:{tDiffuse:{value:null},uRes:{value:new Ie(1,1)},uTime:{value:0},uEnergy:{value:0},uAberration:{value:1},uGrain:{value:.038},uVignette:{value:.9},uShadowTint:{value:new A(.055,.07,.185)},uHighTint:{value:new A(1.03,.985,.94)},uFade:{value:0}},vertexShader:`
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,fragmentShader:`
    precision highp float;

    uniform sampler2D tDiffuse;
    uniform vec2  uRes;
    uniform float uTime;
    uniform float uEnergy;
    uniform float uAberration;
    uniform float uGrain;
    uniform float uVignette;
    uniform vec3  uShadowTint;
    uniform vec3  uHighTint;
    uniform float uFade;

    varying vec2 vUv;

    float hash(vec2 p){
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    void main(){
      vec2 uv = vUv;
      vec2 c  = uv - 0.5;
      float r = length(c);

      // ── chromatic aberration, radial, stronger at the edges and while
      //    the visitor is moving fast
      float amt = (0.0016 + uEnergy * 0.0075) * uAberration;
      vec2 dir  = c * (r * 1.35 + 0.22);
      vec3 col;
      col.r = texture2D(tDiffuse, uv - dir * amt).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv + dir * amt).b;

      // ── gentle S-curve for contrast without crushing the indigo
      col = mix(col, col * col * (3.0 - 2.0 * col), 0.22);

      // ── split tone
      float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
      vec3 shadow = col * uShadowTint * 3.4;
      vec3 high   = col * uHighTint;
      col = mix(mix(shadow, col, smoothstep(0.0, 0.36, lum)), high, smoothstep(0.52, 1.0, lum));

      // ── vignette
      float vig = smoothstep(0.98, 0.24, r * uVignette);
      col *= mix(1.0, vig, 0.72);

      // ── grain, animated, scaled down in the highlights so it stays a whisper
      float g = hash(uv * uRes + fract(uTime) * 137.13) - 0.5;
      col += g * uGrain * (1.0 - lum * 0.62);

      // ── boot fade
      col *= (1.0 - uFade);

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `},g={renderer:null,scene:null,camera:null,composer:null,bloom:null,grade:null,width:0,height:0,usePost:!0};function mo(o){const e=new At({canvas:o,antialias:b.tier>=3,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0});e.setClearColor(T.voidDeep,1),e.setPixelRatio(b.dpr),e.toneMapping=Dt,e.toneMappingExposure=1.06,e.outputColorSpace=Pt,e.autoClear=!0;const t=new Ot;t.fog=new _t(T.void.getHex(),ee);const a=new Ht(60,1,.1,900);return a.position.set(0,3,15),g.renderer=e,g.scene=t,g.camera=a,ho(),ge(),addEventListener("resize",ge,{passive:!0}),addEventListener("orientationchange",ge,{passive:!0}),o.addEventListener("webglcontextlost",n=>{n.preventDefault(),document.body.classList.add("no-gl"),o.classList.remove("is-ready")}),g}function ho(){const{renderer:o,scene:e,camera:t}=g,a=new Wt(o);if(a.setPixelRatio(b.dpr),a.addPass(new Rt(e,t)),b.bloom){const n=new Bt(new Ie(1,1),.62,.72,.58);a.addPass(n),g.bloom=n}else g.bloom=null;if(b.grade){const n=new Gt(vo);a.addPass(n),g.grade=n}else g.grade=null;a.addPass(new Ut),g.composer=a,g.usePost=b.bloom||b.grade}function ge(){const o=innerWidth,e=innerHeight;g.width=o,g.height=e,g.camera.aspect=o/e,g.camera.updateProjectionMatrix(),g.renderer.setPixelRatio(b.dpr),g.renderer.setSize(o,e,!1),g.composer&&(g.composer.setPixelRatio(b.dpr),g.composer.setSize(o,e)),g.grade&&g.grade.uniforms.uRes.value.set(o*b.dpr,e*b.dpr),g.bloom&&g.bloom.setSize(o,e)}function ze(){g.usePost&&g.composer?g.composer.render():g.renderer.render(g.scene,g.camera)}let ve=0,Ge=0;function go(o,e){if(Ge+=o,!(Ge<1)&&(Ge=0,ao.fps<44?ve+=1:ve=Math.max(0,ve-1),ve>=2&&(ve=0,to()))){g.renderer.setPixelRatio(b.dpr);const t=g.composer?g.composer.passes.length:0;!b.bloom&&g.bloom&&t&&(g.composer.removePass(g.bloom),g.bloom.dispose(),g.bloom=null),!b.grade&&g.grade&&(g.composer.removePass(g.grade),g.grade.dispose(),g.grade=null,g.usePost=!!g.bloom),ge(),e&&e(b.tier)}}const de=`
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

/* divergence-free flow field: particles swirl instead of clumping */
vec3 curl(vec3 p){
  const float e = 0.28;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  float p_x0 = snoise(p - dx); float p_x1 = snoise(p + dx);
  float p_y0 = snoise(p - dy); float p_y1 = snoise(p + dy);
  float p_z0 = snoise(p - dz); float p_z1 = snoise(p + dz);

  float x = p_y1 - p_y0 - p_z1 + p_z0;
  float y = p_z1 - p_z0 - p_x1 + p_x0;
  float z = p_x1 - p_x0 - p_y1 + p_y0;

  return normalize(vec3(x, y, z) + 1e-6) * (1.0 / (2.0 * e));
}
`,zt=`
float sprite(vec2 uv, float soft){
  float d = length(uv - 0.5) * 2.0;
  return 1.0 - smoothstep(1.0 - soft, 1.0, d);
}
`,te=`
float fogAmount(float depth, float density){
  float f = depth * density;
  return 1.0 - exp(-f * f);
}
`;function wo(){const o=new jt(520,40,26),e=new N({side:Nt,depthWrite:!1,depthTest:!1,fog:!1,uniforms:{uTime:{value:0},uLow:{value:new y("#04050f")},uMid:{value:new y(T.void)},uHigh:{value:new y("#161c46")},uHaze:{value:new y(T.ai)},uGoal:{value:new y(T.shu)},uGoalK:{value:0}},vertexShader:`
      varying vec3 vDir;
      void main(){
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      precision highp float;
      uniform float uTime;
      uniform vec3 uLow, uMid, uHigh, uHaze, uGoal;
      uniform float uGoalK;
      varying vec3 vDir;

      ${de}

      void main(){
        vec3 d = normalize(vDir);
        float h = d.y * 0.5 + 0.5;

        vec3 col = mix(uLow, uMid, smoothstep(0.18, 0.54, h));
        col = mix(col, uHigh, smoothstep(0.5, 1.0, h));

        // a band of indigo haze sitting on the horizon
        float band = exp(-pow((h - 0.505) * 9.0, 2.0));
        col += uHaze * band * 0.42;

        // very slow cloud drift, kept near the threshold of visible
        float n = snoise(vec3(d.xz * 2.6, uTime * 0.012)) * 0.5 + 0.5;
        col += uHaze * n * band * 0.3;
        col += uHigh * (snoise(vec3(d * 1.5 + vec3(0.0, uTime * 0.008, 0.0))) * 0.5 + 0.5) * 0.045;

        // the destination throws a faint glow back down the journey
        float ahead = max(-d.z, 0.0);
        col += uGoal * pow(ahead, 4.0) * uGoalK;
        col += uGoal * pow(max(ahead, 0.0), 22.0) * uGoalK * 1.6;

        gl_FragColor = vec4(col, 1.0);
      }
    `}),t=new K(o,e);return t.renderOrder=-10,t.frustumCulled=!1,t.name="sky",t.userData.update=(a,n,i)=>{e.uniforms.uTime.value=n,e.uniforms.uGoalK.value=.05+Math.pow(S.p,2.2)*.5,t.position.copy(i.position)},t.userData.dispose=()=>{o.dispose(),e.dispose()},t}function yo(){const o=b.dustCount,e=Le(53335),t=new Float32Array(o*3),a=new Float32Array(o),n=new Float32Array(o);for(let l=0;l<o;l++)t[l*3]=(e()-.5)*190,t[l*3+1]=-10+e()*62,t[l*3+2]=40-e()*500,a[l]=e(),n[l]=.35+Math.pow(e(),3)*2.1;const i=new Me;i.setAttribute("position",new R(t,3)),i.setAttribute("aSeed",new R(a,1)),i.setAttribute("aScale",new R(n,1));const r=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:{uTime:{value:0},uDpr:{value:b.dpr},uFog:{value:ee*.72},uColA:{value:new y(T.bone)},uColB:{value:new y(T.cool)},uColC:{value:new y(T.shuLift)},uOpacity:{value:.5}},vertexShader:`
      precision highp float;
      attribute float aSeed;
      attribute float aScale;
      uniform float uTime, uDpr, uFog;
      varying float vSeed, vAlpha;

      ${te}

      void main(){
        vec3 p = position;
        // slow lateral drift, each speck on its own clock
        p.x += sin(uTime * 0.11 + aSeed * 30.0) * 1.5;
        p.y += cos(uTime * 0.08 + aSeed * 51.0) * 1.1;
        p.z += sin(uTime * 0.06 + aSeed * 17.0) * 1.4;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        gl_PointSize = clamp(aScale * uDpr * (11.0 / dist), 0.4, 10.0);

        vSeed = aSeed;
        vAlpha = (1.0 - fogAmount(dist, uFog)) * smoothstep(0.6, 6.0, dist);
      }
    `,fragmentShader:`
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uColA, uColB, uColC;
      varying float vSeed, vAlpha;

      ${zt}

      void main(){
        float s = sprite(gl_PointCoord, 1.0);
        if (s <= 0.004) discard;
        float tw = 0.35 + 0.65 * pow(abs(sin(uTime * 0.9 + vSeed * 74.0)), 2.2);
        vec3 col = mix(uColA, uColB, vSeed);
        col = mix(col, uColC, step(0.93, vSeed));
        gl_FragColor = vec4(col, s * s * vAlpha * tw * uOpacity);
      }
    `}),s=new Ye(i,r);return s.frustumCulled=!1,s.renderOrder=3,s.name="dust",s.userData.update=(l,f)=>{r.uniforms.uTime.value=f},s.userData.dispose=()=>{i.dispose(),r.dispose()},s}function ct({count:o,box:e,seedNum:t,fallSpeed:a=1}){const n=new we(1,1),i=new $t;i.index=n.index,i.attributes.position=n.attributes.position,i.attributes.uv=n.attributes.uv;const r=Le(t),s=new Float32Array(o*3),l=new Float32Array(o),f=new Float32Array(o);for(let v=0;v<o;v++)s[v*3]=e.x0+r()*(e.x1-e.x0),s[v*3+1]=e.y0+r()*(e.y1-e.y0),s[v*3+2]=e.z0+r()*(e.z1-e.z0),l[v]=r(),f[v]=.12+r()*.2;i.setAttribute("aOffset",new Pe(s,3)),i.setAttribute("aSeed",new Pe(l,1)),i.setAttribute("aScale",new Pe(f,1));const c=new N({transparent:!0,depthWrite:!1,blending:qt,uniforms:{uTime:{value:0},uFall:{value:a},uSpan:{value:e.y1-e.y0},uY0:{value:e.y0},uFog:{value:ee*.9},uColA:{value:new y("#ffd8e0")},uColB:{value:new y("#ff9fae")},uColC:{value:new y(T.shuLift)},uOpacity:{value:.85},uEnergy:{value:0}},vertexShader:`
      precision highp float;
      attribute vec3  aOffset;
      attribute float aSeed;
      attribute float aScale;

      uniform float uTime, uFall, uSpan, uY0, uFog, uEnergy;

      varying vec2  vUv;
      varying float vSeed;
      varying float vAlpha;
      varying float vFace;

      ${te}

      mat2 rot(float a){ float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

      void main(){
        vUv = uv;
        vSeed = aSeed;

        float sp = 0.55 + aSeed * 0.9;
        float y = aOffset.y - mod(uTime * sp * uFall * 0.9, uSpan);
        if (y < uY0) y += uSpan;

        vec3 wp = vec3(
          aOffset.x + sin(uTime * (0.25 + aSeed * 0.4) + aSeed * 60.0) * 1.7,
          y,
          aOffset.z + cos(uTime * (0.2 + aSeed * 0.3) + aSeed * 33.0) * 1.4
        );

        vec4 mv = modelViewMatrix * vec4(wp, 1.0);

        // tumble: spin in screen space and squash on one axis to fake the
        // petal turning over
        float spin = uTime * (0.9 + aSeed * 1.7) + aSeed * 77.0;
        float flip = cos(spin * 0.7);
        vec2 q = position.xy * aScale * vec2(1.0, 1.35);
        q.x *= 0.35 + 0.65 * abs(flip);
        q = rot(spin) * q;
        mv.xy += q;

        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        vFace = abs(flip);
        vAlpha = (1.0 - fogAmount(dist, uFog)) * smoothstep(0.4, 4.0, dist);
      }
    `,fragmentShader:`
      precision highp float;
      uniform vec3 uColA, uColB, uColC;
      uniform float uOpacity;
      varying vec2 vUv;
      varying float vSeed, vAlpha, vFace;

      float petal(vec2 uv){
        vec2 p = (uv - 0.5) * 2.0;
        float d = (p.x * p.x) / 0.58 + (p.y * p.y) / 1.0;
        float body = 1.0 - smoothstep(0.78, 1.02, d);
        // the little notch a sakura petal has at its tip
        float notch = smoothstep(0.0, 0.4, p.y - 0.52 + abs(p.x) * 1.55);
        return clamp(body - notch, 0.0, 1.0);
      }

      void main(){
        float a = petal(vUv);
        if (a <= 0.01) discard;
        vec3 col = mix(uColA, uColB, vSeed);
        col = mix(col, uColC, step(0.9, vSeed) * 0.5);
        col *= 0.62 + 0.38 * vFace;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `}),m=new K(i,c);return m.frustumCulled=!1,m.renderOrder=5,n.dispose(),{mesh:m,mat:c,geo:i}}function xo(){const o=new Q;o.name="sakura";const e=b.tier>=3?300:b.tier===2?170:80,t=ct({count:e,box:{x0:-22,x1:22,y0:-3,y1:22,z0:-26,z1:16},seedNum:23114,fallSpeed:1}),a=ct({count:Math.round(e*.7),box:{x0:-46,x1:46,y0:6,y1:52,z0:-420,z1:-250},seedNum:31868,fallSpeed:.7});return o.add(t.mesh,a.mesh),o.userData.update=(n,i)=>{t.mat.uniforms.uTime.value=i,a.mat.uniforms.uTime.value=i,t.mat.uniforms.uEnergy.value=S.energy,t.mesh.visible=S.p<.3,a.mesh.visible=S.p>.6},o.userData.dispose=()=>{[t,a].forEach(n=>{n.geo.dispose(),n.mat.dispose()})},o}const ke=-2.6,ut=760,dt=-170,bo=`
float waveH(vec2 p, float t){
  float h = 0.0;
  h += sin(p.x * 0.088 + t * 0.52) * 0.26;
  h += sin(p.y * 0.126 - t * 0.40) * 0.19;
  h += sin((p.x * 0.205 + p.y * 0.163) + t * 0.78) * 0.105;
  h += sin((p.x * -0.298 + p.y * 0.262) - t * 1.02) * 0.058;
  h += snoise(vec3(p * 0.055, t * 0.105)) * 0.2;
  return h;
}
`;function So(){const o=b.seaSegments,e=new we(ut,ut,o,o);e.rotateX(-Math.PI/2);const t=new N({transparent:!0,depthWrite:!0,side:gt,uniforms:{uTime:{value:0},uFog:{value:ee},uScale:{value:3.4},uAmp:{value:1},uColDeep:{value:new y(T.voidDeep)},uColBase:{value:new y("#141c46")},uColLine:{value:new y(T.aiSoft)},uColFoam:{value:new y(T.cool)},uColHot:{value:new y(T.shu)},uFogCol:{value:new y(T.void)},uSun:{value:new A(0,16,-430)},uOpacity:{value:1},uEnergy:{value:0}},vertexShader:`
      precision highp float;

      uniform float uTime;
      uniform float uAmp;

      varying vec3  vWorld;
      varying float vHeight;
      varying vec3  vNormal2;
      varying float vDist;

      ${de}
      ${bo}

      void main(){
        vec3 p = position;
        vec2 xz = vec2(p.x, p.z);

        float h = waveH(xz, uTime) * uAmp;
        p.y += h;

        // analytic-ish normal from three samples of the same field
        float e = 1.4;
        float hx = waveH(xz + vec2(e, 0.0), uTime) * uAmp;
        float hz = waveH(xz + vec2(0.0, e), uTime) * uAmp;
        vec3 n = normalize(vec3(h - hx, e, h - hz));

        vec4 world = modelMatrix * vec4(p, 1.0);
        vWorld   = world.xyz;
        vHeight  = h;
        vNormal2 = n;

        vec4 mv = viewMatrix * world;
        vDist = max(-mv.z, 0.001);
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      precision highp float;

      uniform float uTime;
      uniform float uFog;
      uniform float uScale;
      uniform vec3  uColDeep;
      uniform vec3  uColBase;
      uniform vec3  uColLine;
      uniform vec3  uColFoam;
      uniform vec3  uColHot;
      uniform vec3  uFogCol;
      uniform vec3  uSun;
      uniform float uOpacity;
      uniform float uEnergy;

      varying vec3  vWorld;
      varying float vHeight;
      varying vec3  vNormal2;
      varying float vDist;

      ${te}

      /* one grid of concentric rings, masked to its circle */
      float ringField(vec2 p){
        vec2 c = fract(p) - 0.5;
        float d = length(c);
        if (d > 0.5) return 0.0;
        float r = d * 2.0;
        float rings = fract(r * 3.0 + 0.02);
        float band = smoothstep(0.58, 0.94, rings) * smoothstep(0.98, 0.62, rings * 1.02);
        return band * smoothstep(0.5, 0.4, d);
      }

      /* seigaiha: two staggered grids of overlapping circles */
      float seigaiha(vec2 p){
        float a = ringField(p);
        float b = ringField(p + vec2(0.5, 0.5));
        float c = ringField(p + vec2(0.25, 0.5));
        return max(a, max(b, c * 0.55));
      }

      void main(){
        vec2 g = vWorld.xz / uScale;
        g.y += uTime * 0.035;                       // the pattern drifts with the swell
        g.x += sin(vWorld.z * 0.02 + uTime * 0.2) * 0.06;

        float pat = seigaiha(g);

        // the pattern dissolves with distance so it never aliases into noise
        float patFade = smoothstep(240.0, 46.0, vDist);
        pat *= patFade;

        float crest = smoothstep(0.05, 0.42, vHeight);
        float trough = smoothstep(0.0, -0.34, vHeight);

        vec3 col = mix(uColDeep, uColBase, 0.42 + crest * 0.58);
        col = mix(col, uColLine, pat * 0.72);
        col += uColFoam * pat * crest * 0.5;

        // moonpath: a specular streak toward the horizon light
        vec3 toSun = normalize(uSun - vWorld);
        vec3 toEye = normalize(cameraPosition - vWorld);
        vec3 hv = normalize(toSun + toEye);
        float spec = pow(max(dot(vNormal2, hv), 0.0), 46.0);
        float lane = exp(-pow(vWorld.x * 0.026, 2.0));
        col += uColHot * spec * lane * 1.5;
        col += uColFoam * spec * 0.28;

        // a rim of vermillion on the crests, the accent in a rare dose
        col += uColHot * crest * pat * 0.16;
        col = mix(col, uColDeep, trough * 0.4);

        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol, fog);

        // soft radial falloff so the plane never shows an edge
        float edge = 1.0 - smoothstep(210.0, 372.0, length(vWorld.xz - vec2(0.0, ${dt.toFixed(1)})));
        float a = uOpacity * edge * (1.0 - fog * 0.35);

        gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
      }
    `}),a=new K(e,t);return a.position.set(0,ke,dt),a.renderOrder=1,a.frustumCulled=!1,a.name="sea",a.userData.update=(n,i)=>{t.uniforms.uTime.value=i,t.uniforms.uEnergy.value=S.energy,t.uniforms.uAmp.value=1+S.energy*.35},a.userData.dispose=()=>{e.dispose(),t.dispose()},a}const M={pillarX:3.05,pillarTop:5.68,pillarR0:.325,pillarR1:.255,lean:.11,daiwaY:5.66,daiwaR:.4,daiwaH:.2,nukiY:4.74,nukiW:7.5,nukiT:.36,nukiD:.46,strutY:5.42,strutH:1,strutS:.33,shimakiY:5.96,shimakiW:8.7,shimakiT:.26,shimakiD:.52,shimakiRise:.2,kasagiY:6.32,kasagiW:9.5,kasagiT:.36,kasagiD:.66,kasagiRise:.42},Co=new A(0,3.3,0);function To(o){const e=Le(6221079),t=[{w:1.55,part:0,fn:ft(-1)},{w:1.55,part:0,fn:ft(1)},{w:.14,part:2,fn:pt(-1)},{w:.14,part:2,fn:pt(1)},{w:1.28,part:1,fn:zo},{w:.14,part:2,fn:Eo},{w:1.34,part:1,fn:vt(M.shimakiW,M.shimakiY,M.shimakiT,M.shimakiD,M.shimakiRise)},{w:2.36,part:1,fn:vt(M.kasagiW,M.kasagiY,M.kasagiT,M.kasagiD,M.kasagiRise)}],a=t.reduce((m,v)=>m+v.w,0);let n=0;t.forEach((m,v)=>{m.n=v===t.length-1?o-n:Math.round(m.w/a*o),n+=m.n});const i=new Float32Array(o*3),r=new Float32Array(o*3),s=new Float32Array(o),l=new Float32Array(o),f=new Float32Array(o);let c=0;for(const m of t)for(let v=0;v<m.n;v++,c++){const x=e()>.68,p=m.fn(e,x);i[c*3]=p[0],i[c*3+1]=p[1],i[c*3+2]=p[2];const u=so(e),d=17+e()*21;r[c*3]=u[0]*d,r[c*3+1]=Co.y+u[1]*d*.6,r[c*3+2]=u[2]*d+6+e()*12,s[c]=e(),l[c]=.55+Math.pow(e(),2.2)*1.5,f[c]=m.part}return{pos:i,scatter:r,seed:s,scale:l,part:f}}function ft(o){return(e,t)=>{const a=e(),n=a*M.pillarTop,i=M.pillarR0+(M.pillarR1-M.pillarR0)*a,r=t?i*(.87+e()*.13):i*Math.sqrt(e()),s=e()*Math.PI*2,l=o*(M.pillarX-M.lean*a)+Math.cos(s)*r,f=Math.sin(s)*r;return[l,n,f]}}function pt(o){return(e,t)=>{const a=e()*Math.PI*2,n=t?M.daiwaR*(.88+e()*.12):M.daiwaR*Math.sqrt(e());return[o*(M.pillarX-M.lean)+Math.cos(a)*n,M.daiwaY+(e()-.5)*M.daiwaH,Math.sin(a)*n]}}function zo(o,e){return Et(o,e,0,M.nukiY,0,M.nukiW,M.nukiT,M.nukiD)}function Eo(o,e){return Et(o,e,0,M.strutY,0,M.strutS,M.strutH,M.strutS)}function Et(o,e,t,a,n,i,r,s){let l=(o()-.5)*i,f=(o()-.5)*r,c=(o()-.5)*s;if(e){const m=Math.floor(o()*3),v=o()>.5?.5:-.5;m===0?l=v*i:m===1?f=v*r:c=v*s}return[t+l,a+f,n+c]}function vt(o,e,t,a,n){const i=o/2;return(r,s)=>{const l=r()*2-1,f=Math.abs(l),c=l*i,m=n*Math.pow(f,2.35),v=1-.3*Math.pow(f,3.2),x=t*v,p=a*v;let u=(r()-.5)*x,d=(r()-.5)*p;if(s){const z=r()>.5?.5:-.5;r()>.42?u=z*x:d=z*p}return[c,e+m+u,d]}}function ko(){const o=b.toriiCount,{pos:e,scatter:t,seed:a,scale:n,part:i}=To(o),r=new Me;r.setAttribute("position",new R(e,3)),r.setAttribute("aScatter",new R(t,3)),r.setAttribute("aSeed",new R(a,1)),r.setAttribute("aScale",new R(n,1)),r.setAttribute("aPart",new R(i,1)),r.boundingSphere=null,r.computeBoundingSphere();const s=new N({transparent:!0,depthWrite:!1,depthTest:!0,blending:j,uniforms:{uTime:{value:0},uForm:{value:0},uDisperse:{value:0},uSize:{value:b.tier>=3?1:1.35},uDpr:{value:b.dpr},uOpacity:{value:.62},uPointer:{value:new A(0,3.2,400)},uPointerK:{value:0},uFog:{value:ee},uColLo:{value:new y(T.shuDeep)},uColHi:{value:new y(T.shu)},uColHot:{value:new y(T.boneWarm)},uColBeam:{value:new y(T.shuLift)},uEnergy:{value:0}},vertexShader:`
      precision highp float;

      attribute vec3  aScatter;
      attribute float aSeed;
      attribute float aScale;
      attribute float aPart;

      uniform float uTime;
      uniform float uForm;
      uniform float uDisperse;
      uniform float uSize;
      uniform float uDpr;
      uniform vec3  uPointer;
      uniform float uPointerK;
      uniform float uFog;
      uniform float uEnergy;

      varying float vSeed;
      varying float vPart;
      varying float vH;
      varying float vAlpha;
      varying float vHeat;

      ${de}
      ${te}

      void main(){
        vec3 home = position;

        // ── assembly. Each point has its own slightly different arrival
        //    so the gate builds instead of snapping.
        float lag  = 0.32 * aSeed;
        float f    = clamp((uForm - lag) / max(1.0 - lag, 0.001), 0.0, 1.0);
        f = f * f * (3.0 - 2.0 * f);
        vec3 p = mix(aScatter, home, f);

        // ── curl drift, always on, stronger before the gate has formed
        vec3 flow = curl(home * 0.185 + vec3(0.0, 0.0, uTime * 0.075));
        float amp = (0.075 + 0.135 * aSeed) * (0.4 + 0.6 * f) + (1.0 - f) * 1.4;
        p += flow * amp;

        // ── a slow breath so it never looks frozen
        p.y += sin(uTime * 0.62 + aSeed * 41.0) * 0.016;
        p += flow * uEnergy * 0.22;

        // ── cursor pushes the dust aside
        vec3 toP = p - uPointer;
        float d2 = dot(toP, toP);
        float rep = uPointerK * exp(-d2 * 0.048);
        p += normalize(toP + vec3(1e-4)) * rep * 2.1;

        // ── and it comes apart as the camera flies through
        vec3 out3 = normalize(home - vec3(0.0, 3.3, 0.0) + vec3(1e-4));
        p += out3 * uDisperse * (3.0 + aSeed * 3.4);

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        float ps = uSize * aScale * uDpr * (15.5 / dist);
        gl_PointSize = clamp(ps, 0.55, 30.0);

        vSeed  = aSeed;
        vPart  = aPart;
        vH     = clamp(home.y / 6.9, 0.0, 1.0);
        vHeat  = pow(aSeed, 5.5);
        vAlpha = f * (1.0 - uDisperse * 0.82) * (1.0 - fogAmount(dist, uFog));
      }
    `,fragmentShader:`
      precision highp float;

      uniform float uTime;
      uniform float uOpacity;
      uniform vec3  uColLo;
      uniform vec3  uColHi;
      uniform vec3  uColHot;
      uniform vec3  uColBeam;

      varying float vSeed;
      varying float vPart;
      varying float vH;
      varying float vAlpha;
      varying float vHeat;

      ${zt}

      void main(){
        float s = sprite(gl_PointCoord, 0.95);
        if (s <= 0.003) discard;
        s = pow(s, 1.45);

        vec3 col = mix(uColLo, uColHi, smoothstep(0.0, 0.85, vH));
        col = mix(col, uColBeam, step(0.5, vPart) * step(vPart, 1.5) * 0.5);
        // a scattering of white-hot embers, which is what the bloom catches
        col = mix(col, uColHot, vHeat * (0.55 + 0.45 * sin(uTime * 1.9 + vSeed * 57.0)));

        float flick = 0.82 + 0.18 * sin(uTime * 2.6 + vSeed * 83.0);

        gl_FragColor = vec4(col * flick, s * vAlpha * uOpacity);
      }
    `}),l=new Ye(r,s);l.frustumCulled=!1,l.renderOrder=6,l.name="torii";const f=new A(0,3.2,400),c=new A;let m=0;return l.userData.update=(v,x,p)=>{const u=s.uniforms;u.uTime.value=x,u.uEnergy.value=S.energy;const d=ne(.055,.175,S.p);if(u.uDisperse.value=d,l.visible=S.p<.235&&u.uForm.value>.001,!l.visible)return;let z=0;if(w.inside&&!b.touch&&(c.set(w.sx,w.sy,.5).unproject(p),c.sub(p.position),Math.abs(c.z)>1e-4)){const C=-p.position.z/c.z;C>0&&C<400&&(f.copy(p.position).addScaledVector(c,C),z=1)}z*=1-d,m=D(m,z*1.35,6,v),u.uPointerK.value=m,u.uPointer.value.copy(f)},l.userData.form=v=>{s.uniforms.uForm.value=Y(v)},l.userData.dispose=()=>{r.dispose(),s.dispose()},l}const Mo=new A(0,5.2,-60);function Lo(o,e){const t=o/e*Math.PI*2-Math.PI*.36;return new A(Math.cos(t)*5.6,Math.sin(t)*3.9,Math.sin(t*1.7)*2.4)}function Fo(o,e,t,a){const n=(1+Math.sqrt(5))/2,i=2*Math.PI*o/n,r=Math.acos(1-2*(o+.5)/e),s=t*(.55+.45*Math.cbrt(a()));return new A(Math.sin(r)*Math.cos(i)*s,Math.sin(r)*Math.sin(i)*s*.82,Math.cos(r)*s*.8)}function Ao(o){const e=new Q;e.name="skillField",e.position.copy(Mo);const t=new Q;e.add(t);const a=Le(20929),n=Math.max(1,new Set(o.map(k=>k.group)).size),i=o.length,r=new Float32Array(i*3),s=new Float32Array(i),l=new Float32Array(i),f=new Float32Array(i),c=new Float32Array(i),m=new Float32Array(i),v=[],x=new Map;o.forEach(k=>{x.has(k.group)||x.set(k.group,[]),x.get(k.group).push(k)});let p=0;const u=[];[...x.keys()].sort((k,F)=>k-F).forEach((k,F)=>{const I=x.get(k),B=Lo(F,n);u.push(B),I.forEach((W,G)=>{const le=Fo(G,I.length,2.35,a).add(B);r[p*3]=le.x,r[p*3+1]=le.y,r[p*3+2]=le.z,s[p]=W.on?1:0,l[p]=a(),f[p]=W.on?1.15:.78,v.push(le.clone()),W.node=p,p++})});const d=new Me;d.setAttribute("position",new R(r,3)),d.setAttribute("aOn",new R(s,1)),d.setAttribute("aSeed",new R(l,1)),d.setAttribute("aScale",new R(f,1));const z=new R(c,1);z.setUsage(Vt),d.setAttribute("aLit",z),d.computeBoundingSphere();const C=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:{uTime:{value:0},uDpr:{value:b.dpr},uFog:{value:ee},uOpacity:{value:0},uOn:{value:T.shu.clone()},uOff:{value:T.cool.clone()},uHot:{value:T.boneWarm.clone()}},vertexShader:`
      precision highp float;
      attribute float aOn, aSeed, aScale, aLit;
      uniform float uTime, uDpr, uFog;
      varying float vOn, vSeed, vLit, vAlpha;

      ${te}

      void main(){
        vec3 p = position;
        // each node breathes on its own beat
        p += vec3(
          sin(uTime * 0.45 + aSeed * 30.0),
          cos(uTime * 0.38 + aSeed * 51.0),
          sin(uTime * 0.31 + aSeed * 17.0)
        ) * 0.14;

        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;

        float dist = max(-mv.z, 0.001);
        float pulse = 1.0 + 0.12 * sin(uTime * 1.6 + aSeed * 44.0) + aLit * 1.5;
        gl_PointSize = clamp(aScale * pulse * uDpr * (78.0 / dist), 1.0, 74.0);

        vOn = aOn;
        vSeed = aSeed;
        vLit = aLit;
        vAlpha = 1.0 - fogAmount(dist, uFog);
      }
    `,fragmentShader:`
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uOn, uOff, uHot;
      varying float vOn, vSeed, vLit, vAlpha;

      void main(){
        vec2 c = gl_PointCoord - 0.5;
        float d = length(c) * 2.0;

        // a hard little core inside a soft halo
        float core = 1.0 - smoothstep(0.16, 0.34, d);
        float halo = pow(1.0 - smoothstep(0.0, 1.0, d), 2.6);
        // a thin ring for the "learning" state, so it reads as an outline
        float ring = smoothstep(0.5, 0.42, d) * smoothstep(0.3, 0.4, d);

        vec3 base = mix(uOff, uOn, vOn);
        vec3 col  = mix(base, uHot, vLit * 0.65 + core * 0.25);

        float a = mix(ring * 0.9 + halo * 0.3, core + halo * 0.55, vOn);
        a *= (0.55 + 0.45 * vOn) + vLit * 0.9;

        if (a <= 0.004) discard;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `}),E=new Ye(d,C);E.frustumCulled=!1,E.renderOrder=7,t.add(E);const h=[];p=0,[...x.keys()].sort((k,F)=>k-F).forEach((k,F)=>{const I=x.get(k),B=p;for(let W=0;W<I.length;W++){h.push([v[B+W],u[F],s[B+W]]);const G=B+(W+1)%I.length;h.push([v[B+W],v[G],Math.min(s[B+W],s[G])*.7+.3])}h.push([u[F],new A(0,0,0),1]),p+=I.length});for(let k=0;k<u.length;k++)h.push([u[k],u[(k+1)%u.length],.55]);const L=new Float32Array(h.length*2*3),P=new Float32Array(h.length*2),H=new Float32Array(h.length*2),O=new Float32Array(h.length*2);h.forEach((k,F)=>{const[I,B,W]=k;L[F*6]=I.x,L[F*6+1]=I.y,L[F*6+2]=I.z,L[F*6+3]=B.x,L[F*6+4]=B.y,L[F*6+5]=B.z,P[F*2]=0,P[F*2+1]=1,H[F*2]=F,H[F*2+1]=F,O[F*2]=W,O[F*2+1]=W});const X=new Me;X.setAttribute("position",new R(L,3)),X.setAttribute("aT",new R(P,1)),X.setAttribute("aLine",new R(H,1)),X.setAttribute("aOn",new R(O,1));const be=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:{uTime:{value:0},uFog:{value:ee},uOpacity:{value:0},uBase:{value:T.ai.clone()},uHot:{value:T.shu.clone()}},vertexShader:`
      precision highp float;
      attribute float aT, aLine, aOn;
      uniform float uFog;
      varying float vT, vLine, vOn, vAlpha;
      ${te}
      void main(){
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        vT = aT; vLine = aLine; vOn = aOn;
        vAlpha = 1.0 - fogAmount(max(-mv.z, 0.001), uFog);
      }
    `,fragmentShader:`
      precision highp float;
      uniform float uTime, uOpacity;
      uniform vec3 uBase, uHot;
      varying float vT, vLine, vOn, vAlpha;
      void main(){
        // one packet of light travelling each link, offset per link
        float phase = fract(uTime * 0.19 + vLine * 0.137);
        float d = abs(fract(vT - phase + 0.5) - 0.5) * 2.0;
        float pulse = pow(1.0 - d, 14.0);
        vec3 col = mix(uBase, uHot, pulse * vOn);
        float a = (0.2 + pulse * 1.1 * vOn) * vOn;
        gl_FragColor = vec4(col, a * vAlpha * uOpacity);
      }
    `}),Fe=new wt(X,be);Fe.frustumCulled=!1,Fe.renderOrder=6,t.add(Fe);const Se=Je();Se.scale.setScalar(9),t.add(Se);const Ae=new Kt;Ae.params.Points.threshold=.6;const Qe=new Ie;let et=0,De=0,pe=.055,Ce=0,Te=-1,re=!1,se=0;const Lt={get hovered(){return Te},get active(){return re},light(k,F){k>=0&&k<i&&(m[k]=F?1:0)},clearLights(){m.fill(0)}};return e.userData.api=Lt,e.userData.update=(k,F,I)=>{Ze("field");const B=ne(.24,.42,S.p)*(1-ne(.62,.78,S.p));if(se=D(se,B,5,k),e.visible=se>.005,C.uniforms.uOpacity.value=se,be.uniforms.uOpacity.value=se*.9,Se.material.opacity=se*.5,!e.visible){re=!1;return}if(C.uniforms.uTime.value=F,be.uniforms.uTime.value=F,re=B>.45,re&&w.dragging&&!b.touch&&(pe+=w.dx*2.6,Ce+=-w.dy*2),pe=D(pe,re&&w.dragging?pe:.055,1.7,k),Ce=D(Ce,0,2.4,k),et+=pe*k,De=Y(De+Ce*k,-.5,.5),t.rotation.y=et,t.rotation.x=De,re&&w.inside&&!b.touch&&!w.dragging){Qe.set(w.sx,w.sy),Ae.setFromCamera(Qe,I);const G=Ae.intersectObject(E,!1);Te=G.length?G[0].index:-1}else Te=-1;let W=!1;for(let G=0;G<i;G++){const le=Math.max(m[G],G===Te?1:0),tt=D(c[G],le,9,k);Math.abs(tt-c[G])>5e-4&&(c[G]=tt,W=!0)}W&&(z.needsUpdate=!0)},e.userData.dispose=()=>{d.dispose(),C.dispose(),X.dispose(),be.dispose(),Se.material.dispose()},e}let Ue=null;function Je(o="#ff7a5c"){if(!Ue){const a=document.createElement("canvas");a.width=a.height=128;const n=a.getContext("2d"),i=n.createRadialGradient(64,64,0,64,64,64);i.addColorStop(0,"rgba(255,255,255,1)"),i.addColorStop(.22,"rgba(255,255,255,0.5)"),i.addColorStop(.55,"rgba(255,255,255,0.12)"),i.addColorStop(1,"rgba(255,255,255,0)"),n.fillStyle=i,n.fillRect(0,0,128,128),Ue=new yt(a)}const e=new xt({map:Ue,color:o,transparent:!0,depthWrite:!1,blending:j,opacity:.5}),t=new bt(e);return t.renderOrder=4,t}const Do=[{x:-9,z:-106,w:6.4,h:19,d:2.3,tint:T.green,rot:.16},{x:8.6,z:-128,w:7.2,h:24,d:2.6,tint:T.shu,rot:-.2},{x:-5.4,z:-152,w:5.6,h:15,d:2.1,tint:T.cool,rot:.1}];function Po(){const o=new Q;o.name="monoliths";const e=Do.map((t,a)=>{const n=new Q;n.position.set(t.x,0,t.z),n.rotation.y=t.rot;const i=new he(t.w,t.h,t.d,1,12,1),r=new N({transparent:!0,depthWrite:!0,uniforms:{uTime:{value:0},uFog:{value:ee},uH:{value:t.h},uTint:{value:new y(t.tint)},uBase:{value:new y("#0a0d24")},uLine:{value:new y(T.aiSoft)},uFogCol:{value:new y(T.void)},uHot:{value:0},uRise:{value:0},uSeed:{value:a*3.7}},vertexShader:`
        precision highp float;
        uniform float uRise, uH;
        varying vec3 vWorld, vNrm, vLocal;
        varying float vDist;
        void main(){
          vLocal = position;
          vec3 p = position;
          vec4 world = modelMatrix * vec4(p, 1.0);
          vWorld = world.xyz;
          vNrm = normalize(mat3(modelMatrix) * normal);
          vec4 mv = viewMatrix * world;
          vDist = max(-mv.z, 0.001);
          gl_Position = projectionMatrix * mv;
        }
      `,fragmentShader:`
        precision highp float;
        uniform float uTime, uFog, uH, uHot, uRise, uSeed;
        uniform vec3 uTint, uBase, uLine, uFogCol;
        varying vec3 vWorld, vNrm, vLocal;
        varying float vDist;

        ${de}
        ${te}

        void main(){
          float hy = clamp((vLocal.y + uH * 0.5) / uH, 0.0, 1.0);

          // the slab builds upward as it rises into place
          float built = smoothstep(hy - 0.06, hy + 0.02, uRise);
          if (built <= 0.001) discard;

          vec3 V = normalize(cameraPosition - vWorld);
          float fres = pow(1.0 - clamp(dot(vNrm, V), 0.0, 1.0), 2.6);

          vec3 col = mix(uBase * 0.55, uBase, hy);

          // fine grid, like a rack elevation
          vec2 g = vec2(vWorld.x * 1.9 + vWorld.z * 1.9, vLocal.y * 2.6);
          vec2 gl = abs(fract(g) - 0.5);
          float grid = smoothstep(0.47, 0.5, max(gl.x, gl.y));
          col += uLine * grid * 0.1;

          // scan bands crawling up the face
          float band = fract(vLocal.y * 0.34 - uTime * 0.1 + uSeed);
          float scan = pow(smoothstep(0.86, 1.0, band), 2.0);
          col += uTint * scan * 0.28;

          // a slower, wider sweep for life
          float sweep = exp(-pow((fract(vLocal.y * 0.055 - uTime * 0.028 + uSeed * 0.3) - 0.5) * 5.0, 2.0));
          col += uTint * sweep * 0.14;

          // flicker at the threshold of visible
          col += uTint * (snoise(vec3(vWorld.xz * 0.6, uTime * 0.6)) * 0.5 + 0.5) * 0.035;

          // rim
          col += uTint * fres * (0.75 + uHot * 1.4);
          col += vec3(1.0) * pow(fres, 5.0) * 0.28 * (0.4 + uHot);

          // top cap glows
          col += uTint * smoothstep(0.93, 1.0, hy) * (0.4 + uHot * 0.8);

          float fog = fogAmount(vDist, uFog);
          col = mix(col, uFogCol, fog);

          float a = (0.78 + fres * 0.22) * (1.0 - fog * 0.5);
          gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
        }
      `}),s=new K(i,r);s.position.y=t.h/2-2.4,n.add(s);const l=new wt(new It(i,20),new Yt({color:new y(t.tint),transparent:!0,opacity:.34,blending:j,depthWrite:!1}));l.position.copy(s.position),n.add(l);const f=new we(t.w*.42,.12),c=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:{uTime:{value:0},uTint:{value:new y(t.tint)},uK:{value:0}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        precision highp float;
        uniform float uTime; uniform vec3 uTint; uniform float uK;
        varying vec2 vUv;
        void main(){
          float run = fract(vUv.x - uTime * 0.32);
          float head = pow(smoothstep(0.7, 1.0, run), 2.5);
          float glow = 1.0 - smoothstep(0.0, 0.55, abs(vUv.y - 0.5));
          gl_FragColor = vec4(uTint * (0.35 + head * 2.2), (0.3 + head) * glow * uK);
        }
      `}),m=new K(f,c);m.position.set(0,t.h-4.2,t.d/2+.02),n.add(m);const v=Je("#"+new y(t.tint).getHexString());return v.scale.setScalar(t.w*2.2),v.position.set(0,t.h-3,0),v.material.opacity=0,n.add(v),o.add(n),{holder:n,mesh:s,mat:r,edges:l,barMat:c,glow:v,spec:t,hot:0,hotTarget:0}});return o.userData.api={hover(t,a){e[t]&&(e[t].hotTarget=a?1:0)},clear(){e.forEach(t=>t.hotTarget=0)}},o.userData.update=(t,a)=>{const n=Ze("monoliths"),i=ne(.44,.58,S.p)*(1-ne(.84,.94,S.p));o.visible=i>.004,o.visible&&e.forEach((r,s)=>{const l=s*.16,f=Y((n*1.55-l)/.5),c=f*f*(3-2*f);r.hot=D(r.hot,r.hotTarget,7,t),r.mat.uniforms.uTime.value=a,r.mat.uniforms.uRise.value=c,r.mat.uniforms.uHot.value=r.hot,r.barMat.uniforms.uTime.value=a,r.barMat.uniforms.uK.value=c*i,r.edges.material.opacity=(.16+r.hot*.5)*c*i,r.glow.material.opacity=(.1+r.hot*.4)*c*i,r.holder.position.y=Math.sin(a*.24+s*2.1)*.22,r.holder.rotation.y=r.spec.rot+Math.sin(a*.14+s)*.03})},o.userData.dispose=()=>{e.forEach(t=>{t.mesh.geometry.dispose(),t.mat.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.barMat.dispose(),t.glow.material.dispose()})},o}const Oo=[new A(0,-1.6,-184),new A(-5.6,3.2,-203),new A(4.9,8.4,-222),new A(-4.4,13.8,-243),new A(3.7,19.6,-265),new A(0,26.8,-291)],je=["2026","2027","2028","2029","2030","2032"];function _o(){const o=new Q;o.name="path";const e=new Xt(Oo,!1,"catmullrom",.35),t=b.tier>=3?260:140,a=new ot(e,t,.06,7,!1),n=new ot(e,t,.42,9,!1),i=()=>({uTime:{value:0},uFog:{value:ee},uProgress:{value:0},uBase:{value:new y(T.ai)},uHot:{value:new y(T.shu)},uWhite:{value:new y(T.boneWarm)},uFogCol:{value:new y(T.void)},uOpacity:{value:1}}),r=`
    precision highp float;
    varying vec2 vUv;
    varying vec3 vWorld, vNrm;
    varying float vDist;
    void main(){
      vUv = uv;
      vec4 world = modelMatrix * vec4(position, 1.0);
      vWorld = world.xyz;
      vNrm = normalize(mat3(modelMatrix) * normal);
      vec4 mv = viewMatrix * world;
      vDist = max(-mv.z, 0.001);
      gl_Position = projectionMatrix * mv;
    }
  `,s=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:i(),vertexShader:r,fragmentShader:`
      precision highp float;
      uniform float uTime, uFog, uProgress, uOpacity;
      uniform vec3 uBase, uHot, uWhite, uFogCol;
      varying vec2 vUv;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${te}
      void main(){
        // the line draws itself as the visitor climbs
        float drawn = smoothstep(uProgress + 0.012, uProgress - 0.03, vUv.x);
        if (drawn <= 0.002) discard;

        vec3 col = uBase * 1.5;

        // dashes running up the line
        float flow = fract(vUv.x * 42.0 - uTime * 0.5);
        float dash = smoothstep(0.36, 0.5, flow) * smoothstep(1.0, 0.66, flow);
        col = mix(col, uHot, dash * 0.9);

        // one bright packet making the trip
        float head = exp(-pow((fract(vUv.x - uTime * 0.07) - 0.5) * 26.0, 2.0));
        col += uWhite * head * 1.4;

        // the leading tip while it is still being drawn
        float tip = exp(-pow((vUv.x - uProgress) * 90.0, 2.0));
        col += uWhite * tip * 2.2;

        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol, fog * 0.55);

        gl_FragColor = vec4(col, (0.65 + dash * 0.35) * drawn * uOpacity * (1.0 - fog * 0.4));
      }
    `}),l=new N({transparent:!0,depthWrite:!1,blending:j,uniforms:i(),vertexShader:r,fragmentShader:`
      precision highp float;
      uniform float uTime, uFog, uProgress, uOpacity;
      uniform vec3 uBase, uHot, uFogCol;
      varying vec2 vUv;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${te}
      void main(){
        float drawn = smoothstep(uProgress + 0.012, uProgress - 0.05, vUv.x);
        if (drawn <= 0.002) discard;

        vec3 V = normalize(cameraPosition - vWorld);
        float rim = pow(1.0 - abs(dot(vNrm, V)), 2.2);

        vec3 col = mix(uBase, uHot, 0.35 + 0.4 * sin(vUv.x * 8.0 + uTime * 0.4));
        float fog = fogAmount(vDist, uFog);

        gl_FragColor = vec4(col * rim, rim * 0.42 * drawn * uOpacity * (1.0 - fog * 0.5));
      }
    `}),f=new K(a,s),c=new K(n,l);f.frustumCulled=!1,c.frustumCulled=!1,f.renderOrder=8,c.renderOrder=7,o.add(c,f);const m=je.map((p,u)=>{const d=u/(je.length-1),z=e.getPointAt(d),C=u===je.length-1,E=new Q;E.position.copy(z);const h=C?.62:.34,L=new K(new Zt(h,0),new Oe({color:C?T.shu:T.aiSoft,transparent:!0,opacity:.9,blending:j,depthWrite:!1}));E.add(L);const P=new K(new at(C?1.5:.95,.018,6,56),new Oe({color:T.shuLift,transparent:!0,opacity:0,blending:j,depthWrite:!1}));E.add(P);let H=null;C&&(H=new K(new at(2.3,.014,6,64),new Oe({color:T.boneWarm,transparent:!0,opacity:0,blending:j,depthWrite:!1})),E.add(H));const O=Je(C?"#ff4d2e":"#7f92d4");O.scale.setScalar(C?8:3.6),O.material.opacity=0,E.add(O);const X=Ho(p,C);return X.position.set(u%2?2.4:-2.4,.9,0),X.material.opacity=0,E.add(X),o.add(E),{holder:E,coreMesh:L,ring:P,ring2:H,halo:O,label:X,t:d,isGoal:C,lit:0,litTarget:0,year:p,i:u}});let v=null;o.userData.api={highlight(p,u){m[p]&&(m[p].litTarget=u?1:0)},clear(){m.forEach(p=>p.litTarget=0)},onReach(p){v=p},refreshLabels(){m.forEach(p=>{const u=kt(p.year,p.isGoal);p.label.material.map.dispose(),p.label.material.map=u,p.label.material.needsUpdate=!0})}};let x=-1;return o.userData.update=(p,u)=>{const d=ne(.62,.72,S.p)*(1-ne(.985,1,S.p)*.35);if(o.visible=d>.004,!o.visible)return;const z=Ze("path"),C=Y(z*1.28);s.uniforms.uTime.value=u,l.uniforms.uTime.value=u,s.uniforms.uProgress.value=C,l.uniforms.uProgress.value=C,s.uniforms.uOpacity.value=d,l.uniforms.uOpacity.value=d;let E=-1;m.forEach((h,L)=>{const P=C>=h.t-.004?1:0;P&&(E=L);const H=Math.max(P,h.litTarget);h.lit=D(h.lit,H,6,p);const O=.85+.15*Math.sin(u*2+L*1.7);h.coreMesh.material.opacity=(.2+h.lit*.8)*d*O,h.coreMesh.rotation.y=u*.35+L,h.coreMesh.rotation.x=u*.22,h.coreMesh.scale.setScalar(1+h.lit*.35),h.ring.material.opacity=h.lit*.7*d,h.ring.rotation.z=u*(h.isGoal?.28:.5)*(L%2?1:-1),h.ring.rotation.x=.9+Math.sin(u*.3+L)*.2,h.ring2&&(h.ring2.material.opacity=h.lit*.45*d,h.ring2.rotation.z=-u*.18,h.ring2.rotation.y=u*.24),h.halo.material.opacity=h.lit*(h.isGoal?.55:.3)*d*O,h.label.material.opacity=h.lit*.95*d,h.label.scale.set(2.1*(h.isGoal?1.25:1),.72*(h.isGoal?1.25:1),1)}),E!==x&&(x=E,v&&v(E))},o.userData.dispose=()=>{a.dispose(),n.dispose(),s.dispose(),l.dispose(),m.forEach(p=>{p.coreMesh.geometry.dispose(),p.coreMesh.material.dispose(),p.ring.geometry.dispose(),p.ring.material.dispose(),p.ring2&&(p.ring2.geometry.dispose(),p.ring2.material.dispose()),p.halo.material.dispose(),p.label.material.map.dispose(),p.label.material.dispose()})},o}function kt(o,e){const n=document.createElement("canvas");n.width=256,n.height=88;const i=n.getContext("2d");i.clearRect(0,0,256,88),i.font='500 46px "JetBrains Mono", ui-monospace, monospace',i.textAlign="center",i.textBaseline="middle",i.letterSpacing="6px",i.shadowColor=e?"rgba(255,77,46,0.85)":"rgba(127,146,212,0.6)",i.shadowBlur=22,i.fillStyle=e?"#ffd9cf":"#dfe4f6",i.fillText(o,256/2,88/2+2),i.shadowBlur=0,i.fillText(o,256/2,88/2+2);const r=new yt(n);return r.anisotropy=2,r}function Ho(o,e){const t=new xt({map:kt(o,e),transparent:!0,depthWrite:!1,blending:j,opacity:0}),a=new bt(t);return a.scale.set(2.1,.72,1),a.renderOrder=9,a}function Wo(){const o=new Q;o.name="horizon";const e=new we(150,150),t=new N({transparent:!0,depthWrite:!1,depthTest:!1,blending:j,uniforms:{uTime:{value:0},uK:{value:0},uCore:{value:new y("#ffd7bd")},uMid:{value:new y(T.shu)},uOuter:{value:new y(T.shuDeep)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
      precision highp float;
      uniform float uTime, uK;
      uniform vec3 uCore, uMid, uOuter;
      varying vec2 vUv;
      ${de}
      void main(){
        vec2 p = (vUv - 0.5) * 2.0;
        float r = length(p);

        // the disc, with a soft shimmering edge
        float wob = snoise(vec3(p * 5.0, uTime * 0.09)) * 0.012;
        float disc = 1.0 - smoothstep(0.185 + wob, 0.215 + wob, r);

        // corona
        float halo = pow(max(1.0 - r / 0.95, 0.0), 3.4);
        float bloom2 = pow(max(1.0 - r / 0.42, 0.0), 1.6);

        // anamorphic streak across the horizon line
        float streak = exp(-pow(p.y * 34.0, 2.0)) * exp(-pow(p.x * 1.05, 2.0));

        vec3 col = uCore * disc * 1.5;
        col += uMid * bloom2 * 0.75;
        col += uOuter * halo * 0.5;
        col += uMid * streak * 0.55;

        float a = clamp(disc * 1.2 + bloom2 * 0.55 + halo * 0.3 + streak * 0.35, 0.0, 1.0);
        gl_FragColor = vec4(col, a * uK);
      }
    `}),a=new K(e,t);a.position.set(-6,11,-462),a.renderOrder=0,a.frustumCulled=!1,o.add(a);const i=[{z:-444,w:660,h:92,base:.2,amp:.16,freq:2.1,seed:1.3,col:"#0d1230",a:1},{z:-428,w:560,h:74,base:.15,amp:.13,freq:3.4,seed:5.7,col:"#090c22",a:1},{z:-412,w:470,h:56,base:.11,amp:.1,freq:5.2,seed:9.1,col:"#06081a",a:1}].map(l=>{const f=new we(l.w,l.h),c=new N({transparent:!0,depthWrite:!1,side:gt,uniforms:{uK:{value:0},uBase:{value:l.base},uAmp:{value:l.amp},uFreq:{value:l.freq},uSeed:{value:l.seed},uCol:{value:new y(l.col)},uEdge:{value:new y(T.ai)}},vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        precision highp float;
        uniform float uK, uBase, uAmp, uFreq, uSeed;
        uniform vec3 uCol, uEdge;
        varying vec2 vUv;
        ${de}
        void main(){
          float n  = snoise(vec3(vUv.x * uFreq, uSeed, 0.0)) * 0.5 + 0.5;
          float n2 = snoise(vec3(vUv.x * uFreq * 3.7, uSeed * 2.0, 0.0)) * 0.5 + 0.5;
          float ridge = uBase + n * uAmp + n2 * uAmp * 0.34;
          if (vUv.y > ridge) discard;
          // a lit rim right on the skyline
          float rim = smoothstep(ridge - 0.006, ridge, vUv.y);
          vec3 col = mix(uCol, uEdge, rim * 0.85);
          gl_FragColor = vec4(col, uK);
        }
      `}),m=new K(f,c);return m.position.set(0,ke+l.h/2-l.h*.5+l.h*.5-1,l.z),m.position.y=ke-1+l.h/2,m.renderOrder=1,m.frustumCulled=!1,o.add(m),{mesh:m,mat:c}}),r=Ro();r.position.set(3,ke-.4,-398),r.scale.setScalar(3.1),o.add(r);let s=0;return o.userData.update=(l,f)=>{const c=ne(.5,.86,S.p);s=D(s,c,3.5,l),o.visible=s>.004,o.visible&&(t.uniforms.uTime.value=f,t.uniforms.uK.value=s*.92,i.forEach((m,v)=>{m.mat.uniforms.uK.value=s}),r.userData.setK(s,f))},o.userData.dispose=()=>{e.dispose(),t.dispose(),i.forEach(l=>{l.mesh.geometry.dispose(),l.mat.dispose()}),r.userData.dispose()},o}function Ro(){const o=new Q,e=new N({transparent:!0,uniforms:{uK:{value:0},uTime:{value:0},uFog:{value:ee},uBody:{value:new y("#04050f")},uRim:{value:new y(T.shu)},uFogCol:{value:new y(T.void)}},vertexShader:`
      precision highp float;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      void main(){
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorld = world.xyz;
        vNrm = normalize(mat3(modelMatrix) * normal);
        vec4 mv = viewMatrix * world;
        vDist = max(-mv.z, 0.001);
        gl_Position = projectionMatrix * mv;
      }
    `,fragmentShader:`
      precision highp float;
      uniform float uK, uTime, uFog;
      uniform vec3 uBody, uRim, uFogCol;
      varying vec3 vWorld, vNrm;
      varying float vDist;
      ${te}
      void main(){
        vec3 V = normalize(cameraPosition - vWorld);
        float fres = pow(1.0 - clamp(dot(vNrm, V), 0.0, 1.0), 3.2);
        vec3 col = uBody + uRim * fres * 0.9;
        float fog = fogAmount(vDist, uFog);
        col = mix(col, uFogCol * 0.5, fog * 0.5);
        gl_FragColor = vec4(col, uK * (0.88 + fres * 0.12));
      }
    `}),t=[],a=(r,s,l,f)=>{const c=new K(r,e);return c.position.set(s,l,f),c.frustumCulled=!1,c.renderOrder=2,o.add(c),t.push(r),c},n=new Jt(.26,.33,5.7,10);a(n,-3.05,2.85,0),a(n.clone(),3.05,2.85,0),a(new he(7.5,.36,.5),0,4.74,0),a(new he(.33,1,.33),0,5.42,0),a(new he(8.7,.28,.55),0,5.96,0);const i=a(new he(9.5,.38,.7),0,6.36,0);return i.rotation.z=0,o.userData.setK=(r,s)=>{e.uniforms.uK.value=r,e.uniforms.uTime.value=s},o.userData.dispose=()=>{t.forEach(r=>r.dispose()),e.dispose()},o}const oe={torii:{in:{pos:[0,3.05,15.5],look:[0,3.3,0],fov:58},out:{pos:[1.5,3.7,-2.2],look:[.5,3,-16],fov:49}},sea:{in:{pos:[2.7,2.35,-19],look:[1.1,1.35,-34],fov:57},out:{pos:[1.2,4.4,-40],look:[0,5,-56],fov:57}},field:{in:{pos:[-1.6,5.1,-48],look:[.2,5.2,-60],fov:62},out:{pos:[-6.4,6.1,-80],look:[2,7,-104],fov:60}},monoliths:{in:{pos:[-7.4,6.4,-96],look:[3.5,8.5,-120],fov:58},out:{pos:[6.2,7.6,-142],look:[-3,8,-164],fov:58}},path:{in:{pos:[-1.4,3.4,-176],look:[0,9,-202],fov:58},out:{pos:[2.6,17,-244],look:[0,25,-276],fov:54}},record:{in:{pos:[1.4,24,-268],look:[0,25.5,-292],fov:52},out:{pos:[.6,28,-288],look:[0,24,-360],fov:49}},horizon:{in:{pos:[.4,29,-298],look:[-1,23,-400],fov:47},out:{pos:[0,30.5,-312],look:[-3,21,-448],fov:45}}},ae=o=>new A(o[0],o[1],o[2]);function Bo(o){let e=[];const t=new A().copy(o.position),a=new A(0,3.3,0);let n=58,i=0;const r=new A,s=new A,l=new A,f=new A,c=new A,m=new A;function v(){e=[];const u=ye.filter(d=>oe[d.id]);if(!u.length){e=[{at:0,pos:ae(oe.torii.in.pos),look:ae(oe.torii.in.look),fov:oe.torii.in.fov},{at:1,pos:ae(oe.horizon.out.pos),look:ae(oe.horizon.out.look),fov:oe.horizon.out.fov}];return}u.forEach((d,z)=>{const C=oe[d.id],E=Math.max(d.end-d.start,1e-4),h=z===0?0:d.start+E*.12,L=z===u.length-1?1:d.start+E*.9;e.push({at:h,pos:ae(C.in.pos),look:ae(C.in.look),fov:C.in.fov}),e.push({at:L,pos:ae(C.out.pos),look:ae(C.out.look),fov:C.out.fov})}),e.sort((d,z)=>d.at-z.at);for(let d=1;d<e.length;d++)e[d].at<=e[d-1].at&&(e[d].at=e[d-1].at+6e-4);e[0].at=0,e[e.length-1].at=Math.max(1,e[e.length-1].at)}function x(u,d,z){const C=e.length;if(C<2)return 58;let E=0;for(;E<C-2&&u>e[E+1].at;)E++;const h=e[E],L=e[E+1],P=e[Math.max(0,E-1)],H=e[Math.min(C-1,E+2)],O=Y((u-h.at)/(L.at-h.at));return d.set(ie(P.pos.x,h.pos.x,L.pos.x,H.pos.x,O),ie(P.pos.y,h.pos.y,L.pos.y,H.pos.y,O),ie(P.pos.z,h.pos.z,L.pos.z,H.pos.z,O)),z.set(ie(P.look.x,h.look.x,L.look.x,H.look.x,O),ie(P.look.y,h.look.y,L.look.y,H.look.y,O),ie(P.look.z,h.look.z,L.look.z,H.look.z,O)),ie(P.fov,h.fov,L.fov,H.fov,O)}return v(),{build:v,snap(u=0){const d=x(u,r,s);t.copy(r),a.copy(s),n=d,i=0,o.position.copy(t),o.up.set(0,1,0),o.lookAt(a),o.fov=d,o.updateProjectionMatrix()},update(u){const d=x(S.p,r,s);l.copy(t);const z=5+S.energy*7;t.x=D(t.x,r.x,z,u),t.y=D(t.y,r.y,z,u),t.z=D(t.z,r.z,z,u),a.x=D(a.x,s.x,z*.9,u),a.y=D(a.y,s.y,z*.9,u),a.z=D(a.z,s.z,z*.9,u),n=D(n,d,3.4,u),m.copy(a).sub(t).normalize(),f.crossVectors(m,o.up).normalize(),c.crossVectors(f,m).normalize();const C=b.touch?0:1,E=2.1*C;o.position.copy(t),o.position.addScaledVector(f,w.sx*.42*C),o.position.addScaledVector(c,w.sy*.3*C);const h=s.copy(a);h.addScaledVector(f,w.sx*E),h.addScaledVector(c,w.sy*E*.72),o.up.set(0,1,0),o.lookAt(h);const L=(t.x-l.x)/Math.max(u,1e-4),P=Y(-L*.012,-.09,.09)+w.sx*.012;i=D(i,P,3.2,u),o.rotateZ(i),Math.abs(o.fov-n)>.002&&(o.fov=n,o.updateProjectionMatrix())}}}function Go(o){const{scene:e,camera:t}=g,a=new Q;a.name="world",e.add(a);const n=wo(),i=So(),r=yo(),s=ko(),l=Ao(o),f=Po(),c=_o(),m=Wo(),v=b.tier>=2?xo():null,x=[n,i,r,s,l,f,c,m];v&&x.push(v),x.forEach(d=>a.add(d));const p=Bo(t);return p.snap(S.p),{root:a,rig:p,torii:s,api:{skills:l.userData.api,projects:f.userData.api,path:c.userData.api,refreshLabels:c.userData.api.refreshLabels},update(d,z){p.update(d);for(let C=0;C<x.length;C++){const E=x[C].userData.update;E&&E(d,z,t)}},freeze(d=0){p.snap(S.p),s.userData.form(1);for(let z=0;z<x.length;z++){const C=x[z].userData.update;C&&C(.016,d,t)}p.snap(S.p)},remeasure(){p.build()},dispose(){x.forEach(d=>{d.userData.dispose&&d.userData.dispose(),a.remove(d)}),e.remove(a)}}}function Uo(){const o=_("#preloader"),e=_("#plFill"),t=_("#plPct"),a=_("#plStage");let n=0,i=0,r=0;const s=()=>{n+=(i-n)*.14,i-n<.004&&(n=i),e.style.width=(n*100).toFixed(1)+"%",t.textContent=String(Math.round(n*100)).padStart(2,"0"),(n<i-5e-4||n<1)&&(r=requestAnimationFrame(s))},l={set(f,c){i=Math.max(i,Math.min(1,f)),c&&a&&(a.textContent=c),cancelAnimationFrame(r),r=requestAnimationFrame(s)},async finish(){l.set(1,"ready"),await new Promise(f=>setTimeout(f,320)),o.classList.add("is-gone"),await J.timeline().to(".preloader__inner",{y:-22,opacity:0,duration:.55,ease:"power2.in"}).to(o,{clipPath:"inset(0% 0% 100% 0%)",duration:1,ease:"expo.inOut"},"-=0.2").then(),o.style.display="none",cancelAnimationFrame(r)}};return l}J.registerPlugin($);J.ticker.lagSmoothing(0);const me="expo.out",Ne=[];function jo(o){const e=o.textContent.replace(/\s+/g," ").trim();if(!e)return[];o.setAttribute("aria-label",e),o.textContent="",o.style.perspective="620px";const t=[],a=e.split(" ");return a.forEach((n,i)=>{const r=document.createElement("span");r.className="w",r.setAttribute("aria-hidden","true");for(const s of n){const l=document.createElement("span");l.className="ch",l.textContent=s,r.appendChild(l),t.push(l)}o.appendChild(r),i<a.length-1&&o.appendChild(document.createTextNode(" "))}),t}function No(){if(b.reduced)return document.body.classList.add("no-motion"),{hero:()=>{}};const o=(e,t="top 82%")=>({trigger:e,start:t,once:!0});return q("[data-split]").forEach(e=>{const t=jo(e);if(!t.length)return;const a=e.closest(".hero")!==null,n=J.fromTo(t,{yPercent:116,opacity:0,rotateX:-62},{yPercent:0,opacity:1,rotateX:0,duration:1.08,ease:me,stagger:{each:a?.032:.016},paused:a});a?Ne.push(n):(n.pause(),$.create({...o(e,"top 86%"),onEnter:()=>n.play()}))}),q("[data-rise]").forEach(e=>{const t=parseFloat(e.dataset.delay||"0"),a=e.closest(".hero")!==null,n=J.fromTo(e,{y:30,opacity:0},{y:0,opacity:1,duration:1.15,ease:me,delay:a?t:t*.6,paused:!0});a?Ne.push(n):$.create({...o(e),onEnter:()=>n.play()})}),q("[data-stagger]").forEach(e=>{const t=q("[data-fact]",e);if(!t.length)return;const a=J.fromTo(t,{y:34,opacity:0,scale:.975},{y:0,opacity:1,scale:1,duration:1,ease:me,stagger:{each:.07,from:"start"},paused:!0});$.create({...o(e,"top 80%"),onEnter:()=>a.play()})}),q("[data-proj]").forEach((e,t)=>{const a=J.fromTo(e,{x:-26,opacity:0,clipPath:"inset(0 100% 0 0)"},{x:0,opacity:1,clipPath:"inset(0 0% 0 0)",duration:1.25,ease:"expo.inOut",paused:!0});$.create({...o(e,"top 84%"),onEnter:()=>a.play()})}),q(".tl__item").forEach(e=>{const t=J.fromTo(e,{x:22,opacity:0},{x:0,opacity:1,duration:1,ease:me,paused:!0});$.create({...o(e,"top 88%"),onEnter:()=>t.play()})}),q(".edu__item").forEach(e=>{const t=parseFloat(e.dataset.delay||"0"),a=J.fromTo(e,{y:26,opacity:0},{y:0,opacity:1,duration:1.05,ease:me,delay:t*.6,paused:!0});$.create({...o(e,"top 86%"),onEnter:()=>a.play()})}),q("[data-count]").forEach(e=>{const t=e.dataset.count,a=parseFloat(t);if(!isFinite(a))return;const n=(t.split(".")[1]||"").length,i={v:0},r=J.to(i,{v:a,duration:1.9,ease:"power2.out",paused:!0,onUpdate:()=>{e.textContent=i.v.toFixed(n)},onComplete:()=>{e.textContent=t}});e.textContent=0 .toFixed(n),$.create({...o(e,"top 92%"),onEnter:()=>r.play()})}),{hero(){Ne.forEach(e=>e.delay((e.vars.delay||0)+.06).play())},refresh(){$.refresh()}}}const $o=["hero","about","skills","work","path","record","contact"];function qo(){const o=_("#nav"),e=_("#burger"),t=_("#drawer"),a=_(".rail"),n=_("#railFill"),i=_("#railLabel"),r=q("[data-nav]");document.addEventListener("click",v=>{const x=v.target.closest('a[href^="#"]');if(!x)return;const p=x.getAttribute("href");if(!p||p==="#")return;const u=document.querySelector(p);u&&(v.preventDefault(),l(),co(u,{offset:p==="#hero"?0:-10}))});function s(){t.classList.add("is-open"),t.setAttribute("aria-hidden","false"),e.setAttribute("aria-expanded","true"),e.setAttribute("aria-label","Close menu");const v=lt();v?v.stop():document.body.classList.add("is-locked");const x=t.querySelector("a");x&&setTimeout(()=>x.focus({preventScroll:!0}),220)}function l(){if(!t.classList.contains("is-open"))return;t.classList.remove("is-open"),t.setAttribute("aria-hidden","true"),e.setAttribute("aria-expanded","false"),e.setAttribute("aria-label","Open menu");const v=lt();v?v.start():document.body.classList.remove("is-locked")}e.addEventListener("click",()=>{t.classList.contains("is-open")?l():s()}),addEventListener("keydown",v=>{v.key==="Escape"&&l()});let f=!1,c="hero",m=!1;return fe(()=>{const v=S.y>60;v!==f&&(f=v,o.classList.toggle("is-stuck",f));const x=S.p>.02&&S.p<.995;x!==m&&(m=x,a.classList.toggle("is-on",m)),n.style.height=(S.p*100).toFixed(2)+"%";const p=S.y+innerHeight*.42;let u="hero";for(const d of ye){if(p>=d.top&&p<d.top+d.height){u=d.el.id;break}p>=d.top&&(u=d.el.id)}if(u!==c){c=u;const d=Math.max(0,$o.indexOf(c));i.textContent=String(d).padStart(2,"0"),r.forEach(z=>{z.classList.toggle("is-active",z.getAttribute("href")==="#"+c)})}},10),{show(){o.animate([{transform:"translateY(-100%)"},{transform:"translateY(0)"}],{duration:900,easing:"cubic-bezier(0.16, 1, 0.3, 1)",fill:"forwards"})},closeDrawer:l,get activeId(){return c}}}let mt=0;function Mt(o,e=3600){const t=_("#toast");t&&(t.textContent=o,t.classList.add("is-up"),clearTimeout(mt),mt=setTimeout(()=>t.classList.remove("is-up"),e))}const Vo="a, button, input, textarea, label, .chip, .fact, .dlink, [data-proj], .cert";function Ko(){if(b.touch||b.reduced)return{show(){}};const o=_("#cursor"),e=o.querySelector(".cursor__dot"),t=o.querySelector(".cursor__ring");if(!o)return{show(){}};document.documentElement.classList.add("has-cursor");let a=innerWidth/2,n=innerHeight/2,i=!1,r=!1;return addEventListener("pointerover",s=>{const l=s.target,f=l instanceof Element&&l.closest(Vo)!==null;f!==i&&(i=f,o.classList.toggle("is-hot",i));const c=l instanceof Element&&l.closest("#skills")!==null;c!==r&&(r=c,o.classList.toggle("is-drag",r))},{passive:!0}),fe(s=>{e.style.transform=`translate(${w.px}px, ${w.py}px) translate(-50%, -50%)`,a=D(a,w.px,13,s),n=D(n,w.py,13,s),t.style.transform=`translate(${a}px, ${n}px) translate(-50%, -50%)`},20),{show(){o.classList.add("is-on")}}}const ht="arjundineshmenon1@gmail.com",Io=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;function Yo(){const o=_("#cform");if(!o)return;const e=_("#cformNote"),t=e?e.textContent:"",a=[{el:_("#fname"),label:"name",test:i=>i.trim().length>=2},{el:_("#femail"),label:"email",test:i=>Io.test(i.trim())},{el:_("#fmsg"),label:"message",test:i=>i.trim().length>=8}],n=(i,r)=>{e&&(e.textContent=i,e.classList.remove("is-good","is-bad"),r&&e.classList.add(r))};a.forEach(({el:i})=>{i&&i.addEventListener("input",()=>{i.closest(".field").classList.remove("is-bad"),i.removeAttribute("aria-invalid")})}),o.addEventListener("submit",i=>{i.preventDefault();const r=a.filter(({el:x,test:p})=>!x||!p(x.value));if(a.forEach(({el:x})=>x&&x.closest(".field").classList.remove("is-bad")),r.length){r.forEach(({el:u})=>{u&&(u.closest(".field").classList.add("is-bad"),u.setAttribute("aria-invalid","true"))});const x=r[0].el;x&&x.focus({preventScroll:!1});const p=r.map(u=>u.label).join(", ");n(`Still need a valid ${p}.`,"is-bad");return}const s=a[0].el.value.trim(),l=a[1].el.value.trim(),f=a[2].el.value.trim(),c=`Portfolio message from ${s}`,m=`${f}

—
${s}
${l}
`,v=`mailto:${ht}?subject=${encodeURIComponent(c)}&body=${encodeURIComponent(m)}`;window.location.href=v,n("Your email app should be opening with it ready to send.","is-good"),Mt("Handed to your email app · "+ht),setTimeout(()=>{n(t,null)},9e3)})}function Xo(){const o=[];return q("[data-skgroup]").forEach((e,t)=>{q(".chip[data-skill]",e).forEach(a=>{o.push({id:a.dataset.skill,el:a,on:a.classList.contains("is-on"),group:t,node:-1})})}),o}function Zo(o,e){const{api:t}=o,a=new Set;e.forEach(s=>{const l=()=>t.skills.light(s.node,!0),f=()=>{a.has(s.node)||t.skills.light(s.node,!1)};s.el.addEventListener("pointerenter",l),s.el.addEventListener("pointerleave",f),s.el.addEventListener("focus",l),s.el.addEventListener("blur",f),s.el.addEventListener("click",()=>{a.has(s.node)?(a.delete(s.node),s.el.classList.remove("is-lit"),t.skills.light(s.node,!1)):(a.add(s.node),s.el.classList.add("is-lit"),t.skills.light(s.node,!0))}),s.el.setAttribute("aria-pressed","false")});let n=-1;b.touch||fe(()=>{const s=t.skills.hovered;if(s!==n){if(n>=0){const l=e.find(f=>f.node===n);l&&!a.has(l.node)&&l.el.classList.remove("is-lit")}if(s>=0){const l=e.find(f=>f.node===s);l&&l.el.classList.add("is-lit")}n=s}},15);const i=()=>{e.forEach(s=>s.el.setAttribute("aria-pressed",a.has(s.node)?"true":"false"))};document.addEventListener("click",s=>{s.target instanceof Element&&s.target.closest(".chip")&&i()}),q("[data-proj]").forEach((s,l)=>{const f=parseInt(s.dataset.tint||String(l),10);s.addEventListener("pointerenter",()=>t.projects.hover(f,!0)),s.addEventListener("pointerleave",()=>t.projects.hover(f,!1)),s.addEventListener("focusin",()=>t.projects.hover(f,!0)),s.addEventListener("focusout",()=>t.projects.hover(f,!1))});const r=q(".tl__item");return r.forEach((s,l)=>{s.addEventListener("pointerenter",()=>t.path.highlight(l,!0)),s.addEventListener("pointerleave",()=>t.path.highlight(l,!1))}),t.path.onReach(s=>{r.forEach((l,f)=>{l.classList.toggle("is-live",f<=s)})}),{clear(){t.skills.clearLights(),t.projects.clear(),t.path.clear(),a.clear()}}}"scrollRestoration"in history&&(history.scrollRestoration="manual");const Z=Uo();let U=null;function Jo(o=2600){return!document.fonts||!document.fonts.ready?ce(0):Promise.race([document.fonts.ready,ce(o)])}async function Qo(){Z.set(.08,"starting up"),lo(),window.scrollTo(0,0),uo(()=>$.update()),fo();const o=qo(),e=Ko(),t=No();if(Yo(),Ct(),Z.set(.2,"laying out the page"),await Jo(),xe(),$.refresh(),Z.set(.34,"type loaded"),!b.webgl){document.body.classList.add("no-gl"),Z.set(1,"ready"),await $e(o,e,t),Mt("Running without 3D on this device. Everything else works.");return}try{const a=_("#gl");mo(a),Z.set(.46,"compiling shaders"),await ce(16);const n=Xo();if(U=Go(n),Z.set(.62,"building the gate"),await ce(16),g.renderer.compile(g.scene,g.camera),Z.set(.82,"warming up"),await ce(16),U.api.refreshLabels(),U.rig.snap(0),U.update(.016,0),ze(),Z.set(.94,"first frame"),await ce(16),Zo(U,n),a.classList.add("is-ready"),b.reduced)U.freeze(0),ze(),addEventListener("resize",()=>{ge(),U.freeze(0),ze()});else{let r=0;fe(s=>{r+=s,U.update(s,r),g.grade&&(g.grade.uniforms.uTime.value=r,g.grade.uniforms.uEnergy.value=S.energy),ze(),go(s,l=>{U&&U.remeasure()})},50)}let i=0;if(addEventListener("resize",()=>{clearTimeout(i),i=setTimeout(()=>{xe(),U&&U.remeasure(),$.refresh()},160)}),oo(()=>location.reload()),Z.set(1,"ready"),await $e(o,e,t),b.reduced)U.torii.userData.form(1);else{const r={v:0};J.to(r,{v:1,duration:3.1,ease:"power2.inOut",onUpdate:()=>U.torii.userData.form(r.v)})}}catch(a){console.error("[kumo] world failed to start:",a),document.body.classList.add("no-gl");const n=_("#gl");n&&n.classList.remove("is-ready"),Z.set(1,"ready"),await $e(o,e,t)}}async function $e(o,e,t){await Z.finish(),po(),o.show(),e.show(),t.hero(),xe(),$.refresh(),document.documentElement.classList.add("is-booted")}Qo();
