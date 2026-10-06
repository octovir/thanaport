export const surfaceVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMorph;
  uniform float uDistortion;
  uniform float uImpulse;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;
  const float PI = 3.14159265359;
  vec3 surface(vec2 p) {
    float a = p.x * PI * 2.0;
    float b = p.y * PI * 2.0;
    float wave = sin(a * 3.0 + uTime * .55) * cos(b * 2.0 - uTime * .42);
    float tube = mix(.48, 1.18, uMorph) + wave * (.045 + uDistortion * .16) + uImpulse * .1;
    float ring = mix(1.05, .06, uMorph) + sin(a * 2.0 + uTime * .3) * .13 * (1.0-uMorph);
    vec3 result = vec3((ring + tube * cos(b)) * cos(a), (ring + tube * cos(b)) * sin(a), tube * sin(b));
    result.z += sin(a * 3.0 + uTime * .3) * .22 * (1.0-uMorph);
    result.x *= 1.0 + uImpulse * .16;
    result.y *= 1.0 - uImpulse * .12;
    return result;
  }
  void main() {
    vec3 p = surface(uv);
    vec3 tangent = surface(uv + vec2(.0005, 0.0)) - p;
    vec3 bitangent = surface(uv + vec2(0.0, .0005)) - p;
    vec3 n = normalize(cross(tangent, bitangent));
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vNormal = normalize(normalMatrix * n);
    vView = normalize(-mv.xyz);
    vPosition = p;
    gl_Position = projectionMatrix * mv;
  }
`;

export const surfaceFragment = /* glsl */ `
  uniform sampler2D uBackdrop;
  uniform vec2 uResolution;
  uniform float uDispersion;
  uniform float uFrost;
  uniform float uChrome;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vPosition;
  void main() {
    vec3 n = normalize(vNormal);
    if (!gl_FrontFacing) n = -n;
    vec3 view = normalize(vView);
    float facing = abs(dot(n, view));
    float fresnel = pow(1.0 - facing, 2.6);
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 refraction = n.xy * (.07 + .08 * facing);
    float aberration = .001 + uDispersion * .003;
    vec2 coord = uv - refraction;
    vec3 transmitted;
    transmitted.r = texture2D(uBackdrop, clamp(coord + n.xy*aberration, .001, .999)).r;
    transmitted.g = texture2D(uBackdrop, clamp(coord, .001, .999)).g;
    transmitted.b = texture2D(uBackdrop, clamp(coord - n.xy*aberration, .001, .999)).b;
    vec3 blur = vec3(0.0);
    blur += texture2D(uBackdrop, clamp(coord + vec2(.014,.014),.001,.999)).rgb;
    blur += texture2D(uBackdrop, clamp(coord + vec2(-.014,.014),.001,.999)).rgb;
    blur += texture2D(uBackdrop, clamp(coord + vec2(.014,-.014),.001,.999)).rgb;
    blur += texture2D(uBackdrop, clamp(coord - vec2(.014,.014),.001,.999)).rgb;
    transmitted = mix(transmitted, blur*.25, uFrost*.88);
    vec3 reflection = reflect(-view,n);
    float band = pow(.5 + .5*sin(reflection.y*9.0 + reflection.x*3.0), 8.0);
    float edgeLight = pow(max(dot(n,normalize(vec3(-.6, .8, 1.0))),0.0), 45.0);
    float stripLight = pow(max(1.0-abs(reflection.y-.55)*2.8,0.0),14.0);
    vec3 ice = vec3(.18,.54,.91);
    vec3 color = transmitted * vec3(.91,.97,1.0);
    color = mix(color, ice, fresnel*.4);
    color += vec3(.34,.49,.61) * band * fresnel*.7;
    color += vec3(1.0) * (edgeLight*.8 + stripLight*.48);
    color = mix(color, vec3(.72,.87,.97),uFrost*.3);
    vec3 chrome = mix(vec3(.025,.12,.23),vec3(.81,.93,1.0), smoothstep(-.45,.55,reflection.y));
    chrome = mix(chrome,vec3(.12,.35,.6),band*.7) + stripLight*.6 + edgeLight*.7;
    color = mix(color,chrome,uChrome);
    gl_FragColor = vec4(color,1.0);
  }
`;

export const backdropVertex = /* glsl */ `
  varying vec2 vUv;
  void main(){ vUv = uv; gl_Position = vec4(position.xy,0.0,1.0); }
`;
export const backdropFragment = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D uTypeOne;
  uniform sampler2D uTypeTwo;
  uniform sampler2D uTypeThree;
  uniform float uProgress;
  uniform float uAspect;
  void main(){
    vec2 uv = vUv;
    vec2 center = (uv-vec2(.65,.47))*vec2(uAspect,1.0);
    float glow = exp(-dot(center,center)*3.6);
    vec3 color = mix(vec3(.983,.988,.997),vec3(.87,.94,1.0),glow*.55);
    vec2 gridUv = uv*vec2(uAspect,1.0)*29.0;
    vec2 grid = abs(fract(gridUv-.5)-.5) / fwidth(gridUv);
    float line = 1.0-min(min(grid.x,grid.y),1.0);
    color -= line*.003;
    float phaseOne = smoothstep(.18,.43,uProgress);
    float phaseTwo = smoothstep(.62,.85,uProgress);
    vec4 type = mix(texture2D(uTypeOne,uv),texture2D(uTypeTwo,uv),phaseOne);
    type = mix(type,texture2D(uTypeThree,uv),phaseTwo);
    color = mix(color,type.rgb,type.a);
    gl_FragColor = vec4(color,1.0);
  }
`;
