package org.example.skillexchangenetwork.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MessageRequest {
    private Long senderId;
    private Long receiverId;
    private String message;
    private boolean isRead;
}
