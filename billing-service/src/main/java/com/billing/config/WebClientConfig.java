package com.billing.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced  // 🔥 Enables service discovery
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                // ✅ Default header
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")

                // 🔥 Timeout (VERY IMPORTANT)
                .clientConnector(
                        new org.springframework.http.client.reactive.ReactorClientHttpConnector(
                                reactor.netty.http.client.HttpClient.create()
                                        .responseTimeout(Duration.ofSeconds(5))
                        )
                );
    }
}