package com.billing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced  // IMPORTANT for Eureka
    WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}