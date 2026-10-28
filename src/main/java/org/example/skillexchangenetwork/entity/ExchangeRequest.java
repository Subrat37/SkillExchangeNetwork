package org.example.skillexchangenetwork.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.skillexchangenetwork.enums.RequestStatus;

import java.time.LocalDateTime;

@Entity
@Table(name = "ExchangeRequests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExchangeRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderId")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiverId")
    private User receiver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "offeredSkillId")
    private Skill offeredSkill;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requestedSkillId")
    private Skill requestedSkill;

    private String message;
    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){
        this.createdAt = LocalDateTime.now();
    }
}
