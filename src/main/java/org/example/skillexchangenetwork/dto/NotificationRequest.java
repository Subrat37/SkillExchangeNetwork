package org.example.skillexchangenetwork.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationRequest {
    private Long userId;
    private String title;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;
}
