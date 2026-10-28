package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.UserSkillRequest;
import org.example.skillexchangenetwork.dto.UserSkillResponse;
import org.example.skillexchangenetwork.entity.Skill;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.entity.UserSkill;
import org.example.skillexchangenetwork.enums.SkillType;
import org.example.skillexchangenetwork.repository.SkillRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.example.skillexchangenetwork.repository.UserSkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UserSkillService {

    private final UserSkillRepository userSkillRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;

    private UserSkillResponse convertToResponse(UserSkill userSkill) {

        Skill skill = userSkill.getSkill();
        User user = userSkill.getUser();

        UserSkillResponse.SkillInfo skillInfo =
                new UserSkillResponse.SkillInfo(
                        skill.getId(),
                        skill.getName(),
                        skill.getDescription()
                );

        UserSkillResponse.UserInfo userInfo =
                new UserSkillResponse.UserInfo(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                );

        return new UserSkillResponse(
                userSkill.getId(),
                skillInfo,
                userSkill.getSkillType().name(),
                userSkill.getExperience().name(),
                userInfo
        );
    }

    public UserSkillResponse addSkillDetailsIntoProfile(
            Long userId,
            UserSkillRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id " + userId));

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id "
                                        + request.getSkillId()));

        UserSkill userSkill = UserSkill.builder()
                .user(user)
                .skill(skill)
                .skillType(request.getType())
                .experience(request.getLevel())
                .build();

        UserSkill savedSkill = userSkillRepository.save(userSkill);

        return convertToResponse(savedSkill);
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> getAllUserSkill() {

        return userSkillRepository.findAll()
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> getByUserId(Long userId) {

        return userSkillRepository.findByUserId(userId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserSkillResponse> findBySkillType(
            SkillType skillType) {

        return userSkillRepository.findBySkillType(skillType)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    public UserSkillResponse updateUserSkill(
            Long userSkillId,
            UserSkillRequest request) {

        UserSkill userSkill = userSkillRepository.findById(userSkillId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "UserSkill not found with id "
                                        + userSkillId));

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found with id "
                                        + request.getUserId()));

        Skill skill = skillRepository.findById(request.getSkillId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Skill not found with id "
                                        + request.getSkillId()));

        userSkill.setUser(user);
        userSkill.setSkill(skill);
        userSkill.setSkillType(request.getType());
        userSkill.setExperience(request.getLevel());

        UserSkill updatedSkill = userSkillRepository.save(userSkill);

        return convertToResponse(updatedSkill);
    }

    public void deleteUserSkill(Long userSkillId) {

        if (!userSkillRepository.existsById(userSkillId)) {
            throw new RuntimeException(
                    "UserSkill not found with id " + userSkillId);
        }

        userSkillRepository.deleteById(userSkillId);
    }
}