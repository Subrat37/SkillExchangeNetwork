package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.UserSkillRequest;
import org.example.skillexchangenetwork.dto.UserSkillResponse;
import org.example.skillexchangenetwork.enums.SkillType;
import org.example.skillexchangenetwork.service.UserSkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/userSkill")
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500"
})
@RequiredArgsConstructor
public class UserSkillController {

    private final UserSkillService userSkillService;

    @PostMapping("/addSkill/{userId}")
    public ResponseEntity<UserSkillResponse> addSkillDetailsIntoProfile(
            @PathVariable Long userId,
            @RequestBody UserSkillRequest request) {

        return ResponseEntity.ok(
                userSkillService.addSkillDetailsIntoProfile(
                        userId, request));
    }

    @GetMapping
    public ResponseEntity<List<UserSkillResponse>> getAllUserSkill() {

        return ResponseEntity.ok(
                userSkillService.getAllUserSkill());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<UserSkillResponse>> getByUserId(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                userSkillService.getByUserId(userId));
    }

    @GetMapping("/skillType/{skillType}")
    public ResponseEntity<List<UserSkillResponse>> findBySkillType(
            @PathVariable SkillType skillType) {

        return ResponseEntity.ok(
                userSkillService.findBySkillType(skillType));
    }

    @PutMapping("/update/{userSkillId}")
    public ResponseEntity<UserSkillResponse> updateUserSkill(
            @PathVariable Long userSkillId,
            @RequestBody UserSkillRequest request) {

        return ResponseEntity.ok(
                userSkillService.updateUserSkill(
                        userSkillId, request));
    }

    @DeleteMapping("/delete/{userSkillId}")
    public ResponseEntity<Void> deleteUserSkill(
            @PathVariable Long userSkillId) {

        userSkillService.deleteUserSkill(userSkillId);

        return ResponseEntity.noContent().build();
    }
}