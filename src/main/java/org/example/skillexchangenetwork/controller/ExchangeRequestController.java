package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.ExchangeRequests;
import org.example.skillexchangenetwork.entity.ExchangeRequest;
import org.example.skillexchangenetwork.service.ExchangeRequestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exchangeRequest")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class ExchangeRequestController {
    private final ExchangeRequestService exchangeRequestService;

    @PostMapping
    public ResponseEntity<ExchangeRequest> createRequest(@RequestBody ExchangeRequests requests){
        return ResponseEntity.ok(exchangeRequestService.createRequest(requests));
    }
    @GetMapping("{id}")
    public ResponseEntity<ExchangeRequest> getRequestById(@PathVariable Long id){
        return ResponseEntity.ok(exchangeRequestService.getRequestById(id));
    }
    @GetMapping("/getsentRequests/{userId}")
    public ResponseEntity<List<ExchangeRequest>> getSentRequests(@PathVariable Long userId){
        return ResponseEntity.ok(exchangeRequestService.getSentRequests(userId));
    }
    @GetMapping("/getreceivedRequests/{userId}")
    public ResponseEntity<List<ExchangeRequest>> getReceivedRequests(@PathVariable Long userId){
        return ResponseEntity.ok(exchangeRequestService.getReceivedRequests(userId));
    }
    @PutMapping("accept/{requestId}")
    public ResponseEntity<ExchangeRequest> acceptRequest(@PathVariable Long requestId){
        return ResponseEntity.ok(exchangeRequestService.acceptRequest(requestId));
    }
    @PutMapping("reject/{requestId}")
    public ResponseEntity<ExchangeRequest> rejectRequest(@PathVariable Long requestId){
        return ResponseEntity.ok(exchangeRequestService.rejectRequest(requestId));
    }
    @PutMapping("complete/{requestId}")
    public ResponseEntity<ExchangeRequest> completeRequest(@PathVariable Long requestId){
        return ResponseEntity.ok(exchangeRequestService.completeRequest(requestId));
    }
}
