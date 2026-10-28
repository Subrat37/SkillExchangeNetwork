package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.ExchangeRequests;
import org.example.skillexchangenetwork.entity.ExchangeRequest;
import org.example.skillexchangenetwork.entity.Skill;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.enums.RequestStatus;
import org.example.skillexchangenetwork.repository.ExchangeRequestRepository;
import org.example.skillexchangenetwork.repository.SkillRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.example.skillexchangenetwork.enums.RequestStatus.PENDING;

@Service
@RequiredArgsConstructor
public class ExchangeRequestService {
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    public ExchangeRequest createRequest(ExchangeRequests request){
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(()->new RuntimeException("Sender not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(()->new RuntimeException("Receiver not found"));
        Skill offered = skillRepository.findById(request.getOfferedSkillId())
                .orElseThrow(()->new RuntimeException("OfferedSkill not found"));
        Skill requested = skillRepository.findById(request.getRequestedSkillId())
                .orElseThrow(()->new RuntimeException("RequestedSkill not found"));
        if(sender.getId().equals(receiver.getId())){
            throw new RuntimeException("Sender and Receiver cannot be same");
        }
        ExchangeRequest exchange = ExchangeRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .offeredSkill(offered)
                .requestedSkill(requested)
                .message(request.getMessage())
                .status(PENDING)
                .build();
        return exchangeRequestRepository.save(exchange);
    }
    public ExchangeRequest getRequestById(Long id){
        return exchangeRequestRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Request not found with id "+id));
    }
    public List<ExchangeRequest> getSentRequests(Long userId){
        userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));
        return exchangeRequestRepository.findBySenderId(userId);
    }
    public List<ExchangeRequest> getReceivedRequests(Long userId){
        userRepository.findById(userId)
                .orElseThrow(()->new RuntimeException("User not found"));
        return exchangeRequestRepository.findByReceiverId(userId);
    }
    public ExchangeRequest acceptRequest(Long requestId){

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Request not found with id " + requestId));

        request.setStatus(RequestStatus.ACCEPTED);

        return exchangeRequestRepository.save(request);
    }
    public ExchangeRequest rejectRequest(Long requestId){

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Request not found with id " + requestId));

        request.setStatus(RequestStatus.DECLINED);

        return exchangeRequestRepository.save(request);
    }
    public ExchangeRequest completeRequest(Long requestId){

        ExchangeRequest request = exchangeRequestRepository.findById(requestId)
                .orElseThrow(() ->
                        new RuntimeException("Request not found with id " + requestId));

        request.setStatus(RequestStatus.COMPLETED);

        return exchangeRequestRepository.save(request);
    }
}
