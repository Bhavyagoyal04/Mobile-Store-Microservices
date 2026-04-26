package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

@Configuration
public class GatewayConfig {

    @Bean
    RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()

            .route("auth-service", r -> r.path("/auth/**")
                .uri("lb://auth-service"))

            .route("customer-service", r -> r.path("/customers/**")
                .uri("lb://customer-service"))

            .route("mobile-service", r -> r.path("/mobiles/**")
                .uri("lb://mobile-service"))

            .route("order-service", r -> r.path("/orders/**")
                .uri("lb://order-service"))

            .route("billing-service", r -> r.path("/bills/**")
                .uri("lb://billing-service"))

            .build();
    }
}