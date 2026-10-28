package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.MessageRequest;
import org.example.skillexchangenetwork.entity.Message;
import org.example.skillexchangenetwork.service.MessageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class MessageController {
    private final MessageService messageService;

    @PostMapping
    public ResponseEntity<Message> sendMessage(@RequestBody MessageRequest request){
        return ResponseEntity.ok(messageService.sendMessage(request));
    }
    @GetMapping("{messageId}")
    public ResponseEntity<Message> getMessageById(@PathVariable Long messageId){
        return ResponseEntity.ok(messageService.getMessageById(messageId));
    }
    @GetMapping("/getconversation/{senderId}/{receiverId}")
    public ResponseEntity<List<Message>> getConversation(@PathVariable Long senderId, @PathVariable Long receiverId){
        return ResponseEntity.ok(messageService.getConversation(senderId,receiverId));
    }
    @GetMapping("/sentmessage/{userId}")
    public ResponseEntity<List<Message>> getSentMessage(@PathVariable Long userId){
        return ResponseEntity.ok(messageService.getSentMessage(userId));
    }
    @GetMapping("/receivedmessage/{userId}")
    public ResponseEntity<List<Message>> getReceivedMessage(@PathVariable Long userId){
        return ResponseEntity.ok(messageService.getReceivedMessage(userId));
    }
    @GetMapping("/readmessage/{userId}")
    public ResponseEntity<List<Message>> getReadMessage(@PathVariable Long userId){
        return ResponseEntity.ok(messageService.getReadMessages(userId));
    }
    @GetMapping("/unreadmessage/{userId}")
    public ResponseEntity<List<Message>> getUnreadMessage(@PathVariable Long userId){
        return ResponseEntity.ok(messageService.getUnreadMessages(userId));
    }
    @PutMapping("/read/{messageId}")
    public ResponseEntity<Message> markAsRead(@PathVariable Long messageId){
        return ResponseEntity.ok(messageService.markAsRead(messageId));
    }
    @DeleteMapping("/delete/{messageId}")
    public void deleteMessage(@PathVariable Long messageId){
        messageService.deleteMessage(messageId);
    }
}
