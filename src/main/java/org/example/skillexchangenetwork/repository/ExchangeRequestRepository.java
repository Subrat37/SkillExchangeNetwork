package org.example.skillexchangenetwork.repository;

import org.example.skillexchangenetwork.entity.ExchangeRequest;
import org.example.skillexchangenetwork.enums.RequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExchangeRequestRepository extends JpaRepository<ExchangeRequest, Long> {
    List<ExchangeRequest> findByReceiverId(Long receiverId);

    List<ExchangeRequest> findBySenderId(Long senderId);

    List<ExchangeRequest> findByStatus(RequestStatus status);
}
