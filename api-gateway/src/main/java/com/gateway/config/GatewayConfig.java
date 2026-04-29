package com.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()

            // 🔐 AUTH
            .route("auth-service", r -> r.path("/auth/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway", "API-Gateway")
                )
                .uri("lb://auth-service"))

            // 👤 CUSTOMER
            .route("customer-service", r -> r.path("/customers/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway", "API-Gateway")
                )
                .uri("lb://customer-service"))

            // 📱 MOBILE
            .route("mobile-service", r -> r.path("/mobiles/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway", "API-Gateway")
                )
                .uri("lb://mobile-service"))

            // 🧾 ORDER
            .route("order-service", r -> r.path("/orders/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway", "API-Gateway")
                )
                .uri("lb://order-service"))

            // 💰 BILLING
            .route("billing-service", r -> r.path("/bills/**")
                .filters(f -> f
                    .addRequestHeader("X-Gateway", "API-Gateway")
                )
                .uri("lb://billing-service"))

            .build();
    }
}