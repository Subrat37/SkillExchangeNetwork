package org.example.skillexchangenetwork.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "Messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "senderId")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiverId")
    private User receiver;

    @Column(nullable = false)
    private String message;

    private LocalDateTime sendAt;
    private boolean isRead;

    @PrePersist
    public void onSend(){
        this.sendAt = LocalDateTime.now();
    }
}
