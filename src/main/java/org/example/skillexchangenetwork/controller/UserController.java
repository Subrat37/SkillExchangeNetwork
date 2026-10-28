package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.LoginRequest;
import org.example.skillexchangenetwork.dto.UserRequest;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody UserRequest request){
        return ResponseEntity.ok(userService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request){
        return ResponseEntity.ok(userService.login(request));
    }
    @GetMapping
    public ResponseEntity<List<User>> getAllUser(){
        return ResponseEntity.ok(userService.getAllUser());
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id,@RequestBody UserRequest request){
        return ResponseEntity.ok(userService.updateUser(id,request));
    }
    @DeleteMapping("/delete/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }
    @GetMapping("{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        return ResponseEntity.ok(userService.getById(id));
    }
}
