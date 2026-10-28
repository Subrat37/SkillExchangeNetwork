package org.example.skillexchangenetwork.repository;

import org.example.skillexchangenetwork.entity.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    List<UserProfile> findByCity(String city);

}
