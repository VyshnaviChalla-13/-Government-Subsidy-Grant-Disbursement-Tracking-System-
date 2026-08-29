package com.example.Government.subsidy.Project.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String auth = request.getHeader("Authorization");

        if (auth != null && auth.startsWith("Bearer ")) {

            String token = auth.substring(7);

            if (jwtUtil.validateToken(token)) {

                String mobileNumber = jwtUtil.extractmobileNumber(token);
                String role = jwtUtil.extractRole(token);

                java.util.List<GrantedAuthority> authorities = new java.util.ArrayList<>();
                if (role != null && !role.isBlank()) {
                    String clean = role.trim().toUpperCase();
                    String withRole = clean.startsWith("ROLE_") ? clean : "ROLE_" + clean;
                    String withoutRole = clean.startsWith("ROLE_") ? clean.substring(5) : clean;

                    authorities.add(new SimpleGrantedAuthority(withRole));
                    authorities.add(new SimpleGrantedAuthority(withoutRole));

                    if (clean.contains("SUPER") && clean.contains("ADMIN")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_SUPER_ADMIN"));
                        authorities.add(new SimpleGrantedAuthority("SUPER_ADMIN"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_SUPERADMIN"));
                        authorities.add(new SimpleGrantedAuthority("SUPERADMIN"));
                    }
                    if ((clean.contains("DEPT") || clean.contains("DEPARTMENT")) && clean.contains("ADMIN")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_DEPT_ADMIN"));
                        authorities.add(new SimpleGrantedAuthority("DEPT_ADMIN"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_DEPTADMIN"));
                        authorities.add(new SimpleGrantedAuthority("DEPTADMIN"));
                    }
                    if (clean.contains("VERIF") || clean.contains("DISTRICT") || clean.equals("ROLE_OFFICER") || clean.equals("OFFICER")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_VERIFICATION_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("VERIFICATION_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_DISTRICT_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("DISTRICT_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("OFFICER"));
                    }
                    if (clean.contains("FRONT") || clean.contains("FIELD")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_FRONT_DESK_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("FRONT_DESK_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_FIELD_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("FIELD_OFFICER"));
                    }
                    if (clean.contains("FINANCE")) {
                        authorities.add(new SimpleGrantedAuthority("ROLE_FINANCE_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("FINANCE_OFFICER"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_FINANCE_APPROVER"));
                        authorities.add(new SimpleGrantedAuthority("FINANCE_APPROVER"));
                        authorities.add(new SimpleGrantedAuthority("ROLE_FINANCE"));
                        authorities.add(new SimpleGrantedAuthority("FINANCE"));
                    }
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                mobileNumber,
                                null,
                                authorities);

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}