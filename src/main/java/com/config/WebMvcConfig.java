package com.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;



@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Value("${jwt.secret: abcd}")
    private String jwtToken;

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		// @formatter:off
		registry.addMapping("/**")
		.allowedOrigins(
			"http://localhost:3000",
			"http://localhost:3001").exposedHeaders(jwtToken)		
//		.allowedMethods("*"
//				HttpMethod.GET.name(),
//				HttpMethod.POST.name(),
//				HttpMethod.OPTIONS.name(),
//				HttpMethod.HEAD.name()
//		)
////		.allowedHeaders("*"
////		)
//		.allowCredentials(false)
//		.maxAge(3600) // 3600초 동안 preflight 결과를 캐시에 저장
		;
		// @formatter:on
	}
}
