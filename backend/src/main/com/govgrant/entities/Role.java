package com.govgrant.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayLIst;
import java.util.List;

@Entity
@Table(name='roles')
@Gettr
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class Role{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="role_id")
    private Integer roleId;

    @Column(name="role_name", nullable=false, unique=true, length=50)
    private String roleName;

    @Columne(name="description", length=255)
    private String description;

    @OneToMany(mappedBy="role", fetch=FetchType.LAZY)
    private List<User> users = new ArrayList<>();
}