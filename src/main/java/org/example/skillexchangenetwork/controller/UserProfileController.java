package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.UserProfileRequest;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.entity.UserProfile;
import org.example.skillexchangenetwork.service.UserProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userProfile")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class UserProfileController {
    private final UserProfileService userProfileService;
    @PostMapping("/createProfile/{userId}")
    public ResponseEntity<UserProfile> createProfile(@PathVariable Long userId, @RequestBody UserProfileRequest request){
        return ResponseEntity.ok(userProfileService.createProfile(userId,request));
    }
    @GetMapping
    public ResponseEntity<List<UserProfile>> getAllProfile(){
        return ResponseEntity.ok(userProfileService.getAllProfiles());
    }
    @GetMapping("{id}")
    public ResponseEntity<UserProfile> getProfileById(@PathVariable Long id){
        return  ResponseEntity.ok(userProfileService.getProfileById(id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<UserProfile> updateProfile(@PathVariable Long id, @RequestBody UserProfile profile){
        return ResponseEntity.ok(userProfileService.updateProfile(id,profile));
    }
    @DeleteMapping("/delete/{id}")
    public void deleteProfile(@PathVariable Long id){
        userProfileService.deleteProfile(id);
    }
    @GetMapping("{cityName}")
    public ResponseEntity<List<User>> findByProfile_City(
            String cityName) {
        return ResponseEntity.ok(
                userProfileService.findByProfile_City(cityName)
        );
    }
}
