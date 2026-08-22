package com.example.Government.subsidy.Project.Repository;

import com.example.Government.subsidy.Project.Entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByUserIdOrderByCreatedAtDesc(Integer userId);

    List<Notification>
    findByUserIdAndIsReadFalseOrderByCreatedAtDesc(
            Integer userId
    );

    long countByUserIdAndIsReadFalse(Integer userId);
}
