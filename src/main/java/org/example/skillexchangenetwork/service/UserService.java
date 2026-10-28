package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.LoginRequest;
import org.example.skillexchangenetwork.dto.UserRequest;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    public User register(UserRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(request.getPassword())
                .phone(request.getPhone())
                .build();

        return userRepository.save(user);
    }
    public User login(LoginRequest request){
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()-> new RuntimeException("User not found with email "+request.getEmail()));
        if (!user.getPassword().equals(request.getPassword())){
            throw new RuntimeException("Invalid password");
        }
        return user;
    }
    public List<User> getAllUser(){
        return userRepository.findAll();
    }
    public User getById(Long id){
        return userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found with id "+id));
    }

    //updateUser()
    public User updateUser(Long id,UserRequest request){
        User user = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found with id "+id));
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPassword(request.getPassword());
        return userRepository.save(user);
    }
    //deleteUser()
    public void deleteUser(Long id){
        User user = userRepository.findById(id)
                .orElseThrow(()->new RuntimeException("User not found with id "+id));
        userRepository.delete(user);
    }
}
