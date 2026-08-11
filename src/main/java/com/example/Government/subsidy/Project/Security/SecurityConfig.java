package com.example.Government.subsidy.Project.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    JwtFilter jwtFilter;

    @Bean
    PasswordEncoder passwordEncoder(){

        return new BCryptPasswordEncoder();
    }

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception{

        http

                .csrf(csrf->csrf.disable())

                .authorizeHttpRequests(auth->auth

                                // Let CORS preflight (OPTIONS) requests through unauthenticated -
                                // browsers never attach the JWT to a preflight, so without this
                                // every cross-origin call from the React app (localhost:5173) to
                                // this backend (localhost:8080) gets blocked with 403 before it
                                // even reaches the controller.
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(
                                "/users/register",
                                "/users/login",
                                "/otp/**"
                        ).permitAll()
                        .requestMatchers("/superadmin/**")
                        .hasRole("SUPER_ADMIN")

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                        jwtFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

}