package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.UserProfileRequest;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.entity.UserProfile;
import org.example.skillexchangenetwork.repository.UserProfileRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserProfileService {
    private final UserProfileRepository userProfileRepository;
    private final UserRepository userRepository;

    public UserProfile createProfile(Long userId,UserProfileRequest request){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        UserProfile profile = UserProfile.builder()
                .bio(request.getBio())
                .city(request.getCity())
                .available(request.isAvailable())
                .profilePhoto(request.getProfilePhoto())
                .user(user)
                .build();
        return userProfileRepository.save(profile);
    }

    public List<UserProfile> getAllProfiles() {
        return userProfileRepository.findAll();
    }

    public UserProfile getProfileById(Long id) {

        return userProfileRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User profile not found with id: " + id));
    }

    public UserProfile updateProfile(Long id, UserProfile profile) {

        UserProfile existingProfile = userProfileRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("User profile not found with id: " + id));

        existingProfile.setBio(profile.getBio());
        existingProfile.setCity(profile.getCity());
        existingProfile.setProfilePhoto(profile.getProfilePhoto());

        return userProfileRepository.save(existingProfile);
    }

    public void deleteProfile(Long id) {

        if (!userProfileRepository.existsById(id)) {
            throw new RuntimeException(
                    "User profile not found with id: " + id);
        }

        userProfileRepository.deleteById(id);
    }

    public List<User> findByProfile_City(String cityName){
        return userRepository.findByProfile_City(cityName);
    }
}
