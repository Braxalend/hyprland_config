#version 100
// Matrix digital rain — лёгкий (без raymarch/циклов), GLSL ES 1.00 для glpaper.
// uniforms glpaper: time (сек), resolution (px).
precision highp float;
uniform float time;
uniform vec2 resolution;

float rand(vec2 c){ return fract(sin(dot(c, vec2(12.9898, 78.233))) * 43758.5453); }

void main() {
    vec2 res = resolution;
    float cell = res.y / 34.0;                 // ~34 строки «символов»
    vec2 g = floor(gl_FragCoord.xy / cell);    // координата ячейки
    float colRand = rand(vec2(g.x, 3.0));
    float speed = (0.5 + colRand * 1.7) * cell * 5.5;
    // «голова» струи падает сверху вниз (gl_FragCoord.y растёт вверх)
    float headY = res.y - mod(time * speed + colRand * res.y * 2.0, res.y * 1.6);
    float dist = (headY - g.y * cell) / cell;  // ячейки ниже головы: dist>0

    float bright = 0.0;
    if (dist >= 0.0) bright = exp(-dist * 0.22);          // затухающий хвост
    float flick = rand(g + floor(vec2(0.0, time * 9.0))); // мерцание «символов»
    bright *= 0.35 + 0.65 * step(0.35, flick);

    // маска суб-ячейки (грубый «глиф»-блок)
    vec2 f = fract(gl_FragCoord.xy / cell);
    float mask = step(0.12, f.x) * step(f.x, 0.88) * step(0.08, f.y) * step(f.y, 0.92);
    bright *= mask;

    vec3 col = vec3(0.0, 0.85, 0.28) * bright;                // matrix-зелёный
    if (dist >= 0.0 && dist < 1.0) col += vec3(0.7, 1.0, 0.8) * 0.9 * mask; // яркая голова
    gl_FragColor = vec4(col, 1.0);
}
