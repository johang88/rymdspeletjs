/// <reference path="rse/Renderer.ts" />
/// <reference path="rse/Shader.ts" />

let renderer = new rse.Renderer("#glCanvas");

let shader = rse.Shader.fromScript("sprite_vertex_shader", "sprite_fragment_shader");