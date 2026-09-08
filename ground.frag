#version 330 core

out vec4 FragColor;
in vec3 color;
in vec2 texCoord;

in vec3 Normal;
in vec3 curPos;

uniform sampler2D diffuse0;
uniform sampler2D specular0;

uniform vec4 lightColor;
uniform vec3 lightPos;
uniform vec3 camPos;


vec4 pointLight(){

	vec3 lightVec = lightPos - curPos;
	float d = length(lightVec);
	float a = 3.0f;
	float b = 1.0f;
	float intencity = 1.0f/(a * d * d + b * d + 1.0f);

	float ambient = 0.2f;

	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(lightVec);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - curPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	return (texture(diffuse0, texCoord)  * (diffuse * intencity + ambient) + texture(specular0, texCoord).r * specular * intencity) * lightColor;

}

vec4 directLight(){

	float ambient = 0.2f;

	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(vec3(1.0f, 1.0f, 0.0f));
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - curPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	return (texture(diffuse0, texCoord)  * (diffuse + ambient) + texture(specular0, texCoord).r * specular) * lightColor;

}

vec4 spotLight(){
	
	float outerCone = 0.90f;
	float innerCone = 0.95f;

	float ambient = 0.2f;

	vec3 normal = normalize(Normal);
	vec3 lightDirection = normalize(camPos - curPos);
	float diffuse = max(dot(normal, lightDirection), 0.0f);

	float specularLight = 0.5f;
	vec3 viewDirection = normalize(camPos - curPos);
	vec3 reflectionDirection = reflect(-lightDirection, normal);
	float specAmount = pow(max(dot(viewDirection, reflectionDirection), 0.0f), 16);
	float specular = specAmount * specularLight;

	float angle = dot(vec3(0.0f, -1.0f, 0.0f), -lightDirection);
	float intencity = clamp((angle - outerCone)/(innerCone - outerCone), 0.0f, 1.0f);

	return (texture(diffuse0, texCoord)  * (diffuse * intencity + ambient) + texture(specular0, texCoord).r * specular * intencity) * lightColor;

}

float near = 0.1f;
float far = 100.0f;

float linearizeDepth(float depth){
	return (2.0f * near * far) / (far + near - (depth * 2.0f - 1.0f) * (far - near));
}

float logisticDepth(float depth, float steepness = 0.3f, float offset = 5.0f){
	float zVal = linearizeDepth(depth);
	return (1 / (1 + exp(-steepness * (zVal - offset))));
}

void main(){
float depth = logisticDepth(gl_FragCoord.z);
//FragColor = directLight() * (1.0f - depth) + vec4(depth * vec3(0.85f, 0.85f, 0.90f), 1.0f);
FragColor = directLight();
}
