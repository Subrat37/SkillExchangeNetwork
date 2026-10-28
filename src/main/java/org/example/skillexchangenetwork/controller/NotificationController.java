package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.NotificationRequest;
import org.example.skillexchangenetwork.entity.Notification;
import org.example.skillexchangenetwork.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notification")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationRequest request){
        return ResponseEntity.ok(notificationService.createNotification(request));
    }
    @GetMapping("{NotificationId}")
    public ResponseEntity<Notification> getNotificationById(Long NotificationId){
        return ResponseEntity.ok(notificationService.getNotificationById(NotificationId));
    }
    @GetMapping("/byuser/{userId}")
    public ResponseEntity<List<Notification>> findByUserId(@PathVariable Long userId){
        return ResponseEntity.ok(notificationService.findByUserId(userId));
    }
    @GetMapping("/unreadNotification/{userId}")
    public ResponseEntity<List<Notification>> getUnreadNotification(@PathVariable Long userId){
        return ResponseEntity.ok(notificationService.getUnreadNotifications(userId));
    }
    @PutMapping("/markAsRead/{notificationId}")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long notificationId){
        return ResponseEntity.ok(notificationService.markAsRead(notificationId));
    }
    @DeleteMapping("/delete/{notificationId}")
    public void deleteNotification(@PathVariable Long notificationId){
        notificationService.deleteNotification(notificationId);
    }
}
