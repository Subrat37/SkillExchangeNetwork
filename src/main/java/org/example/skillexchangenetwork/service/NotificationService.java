package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.NotificationRequest;
import org.example.skillexchangenetwork.entity.Notification;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.repository.NotificationRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public Notification createNotification(NotificationRequest request){
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(()->new RuntimeException("User not found"));
        Notification notification = Notification.builder()
                .user(user)
                .title(request.getTitle())
                .message(request.getMessage())
                .isRead(false)
                .createdAt(request.getCreatedAt())
                .build();
        return notificationRepository.save(notification);
    }
    public Notification getNotificationById(Long NotificationId){
        return notificationRepository.findById(NotificationId)
                .orElseThrow(()->new RuntimeException("Notification not found with id "+NotificationId));
    }
    public List<Notification> findByUserId(Long userId){
        return notificationRepository.findByUserId(userId);
    }
    public List<Notification> getUnreadNotifications(Long userId){
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }
    public Notification markAsRead(Long notificationId){
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(()->new RuntimeException("Notification not found with id "+notificationId));
        notification.setRead(true);
        return notificationRepository.save(notification);
    }
    public void deleteNotification(Long notificationId){
        notificationRepository.deleteById(notificationId);
    }
}
