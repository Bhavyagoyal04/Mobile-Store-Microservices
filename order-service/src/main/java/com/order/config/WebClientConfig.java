package com.order.config;

import org.springframework.cloud.client.loadbalancer.LoadBalanced;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;

@Configuration
public class WebClientConfig {

    @Bean
    @LoadBalanced
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, "application/json")
                .clientConnector(
                        new org.springframework.http.client.reactive.ReactorClientHttpConnector(
                                reactor.netty.http.client.HttpClient.create()
                                        .responseTimeout(Duration.ofSeconds(5)) // 🔥 timeout
                        )
                );
    }
}