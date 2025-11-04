package com.stockmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class StockmanagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(StockmanagerApplication.class, args);
    }

}