#version 330 core


layout (location = 0) in vec3 aPos;

layout (location = 1) in vec3 aNormal;
layout (location = 2) in vec3 aColor;
layout (location = 3) in vec2 aTex;


out vec3 color;

out vec2 texCoord;

out vec3 Normal;
out vec3 curPos;

uniform mat4 camMatrix;
uniform mat4 model;

uniform mat4 translation;
uniform mat4 rotation;
uniform mat4 scale;

void main(){

curPos = vec3(model * translation * rotation * scale * vec4(aPos, 1.0f));
color = aColor;
texCoord = mat2(0.0f, -1.0f, 1.0f, 0.0f) * aTex;
Normal = aNormal;

gl_Position = camMatrix * vec4(curPos, 1.0f);
}
