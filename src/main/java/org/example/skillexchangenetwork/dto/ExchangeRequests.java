package org.example.skillexchangenetwork.dto;

import lombok.*;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.entity.UserSkill;
import org.example.skillexchangenetwork.enums.RequestStatus;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRequests {
    private Long id;

    private Long senderId;

    private Long receiverId;

    private Long offeredSkillId;

    private Long requestedSkillId;

    private String message;

    private RequestStatus status;

}
