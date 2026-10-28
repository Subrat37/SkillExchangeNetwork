package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.MessageRequest;
import org.example.skillexchangenetwork.entity.Message;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.repository.MessageRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    public Message sendMessage(MessageRequest request){
        User sender = userRepository.findById(request.getSenderId())
                .orElseThrow(()->new RuntimeException("Sender is not found"));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(()->new RuntimeException("Receiver is not found"));
        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .message(request.getMessage())
                .isRead(false)
                .sendAt(LocalDateTime.now())
                .build();
        return messageRepository.save(message);
    }

    public Message getMessageById(Long messageId){
        return messageRepository.findById(messageId)
                .orElseThrow(()->new RuntimeException("Message not found with id "+messageId));
    }
    public List<Message> getConversation(Long senderId, Long receiverId){
        return messageRepository.findConversation(senderId,receiverId);
    }
    public List<Message> getSentMessage(Long userId){
        return messageRepository.findBySenderId(userId);
    }
    public List<Message> getReceivedMessage(Long userId){
        return messageRepository.findByReceiverId(userId);
    }
    public List<Message> getReadMessages(Long userId) {
        return messageRepository.findByReceiverIdAndIsReadTrue(userId);
    }
    public List<Message> getUnreadMessages(Long userId) {
        return messageRepository.findByReceiverIdAndIsReadFalse(userId);
    }
    public Message markAsRead(Long messageId){
        Message message = messageRepository.findById(messageId)
                .orElseThrow(()->new RuntimeException("Message not found"));
        message.setRead(true);

        return messageRepository.save(message);
    }
    public void deleteMessage(Long messageId){
        messageRepository.deleteById(messageId);
    }

}
