package org.example.skillexchangenetwork.repository;

import org.example.skillexchangenetwork.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserId(Long userId);
    List<Notification> findByTitle(String title);
    List<Notification> findByUserIdAndIsReadFalse(Long userId);
}
