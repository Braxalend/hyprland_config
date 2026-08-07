#version 100
// fbm-дым (domain-warped fractal noise). GLSL ES 1.00 для glpaper.
// uniforms glpaper (сверено по исходникам paper.c: glGetUniformLocation "time"/"resolution"):
//   time — секунды, resolution — px. gl_FragCoord / gl_FragColor.
// Баг оригинала исправлен: в rand() закрыта скобка fract(...).
precision highp float;
uniform float time;
uniform vec2 resolution;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u * u * (3.0 - 2.0 * u);
    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res * res;
}

float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {   // 5 октав (ES 100: константные границы цикла)
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 p = uv * 3.0;
    float t = time * 0.15;
    vec2 q = vec2(fbm(p + vec2(0.0, t)), fbm(p + vec2(5.2, 1.3) - t));
    vec2 r = vec2(fbm(p + 4.0 * q + vec2(1.7, 9.2) + 0.5 * t),
                  fbm(p + 4.0 * q + vec2(8.3, 2.8)));
    float f = fbm(p + 4.0 * r);
    float d = clamp(f * f + 0.6 * r.x, 0.0, 1.0);

    vec3 bg    = vec3(0.05, 0.07, 0.1);   // фон (тёмно-серо-синий)
    vec3 smoke = vec3(0.6, 0.65, 0.7);    // дым (серый)
    vec3 col = mix(bg, smoke, d);
    gl_FragColor = vec4(col, 1.0);
}
