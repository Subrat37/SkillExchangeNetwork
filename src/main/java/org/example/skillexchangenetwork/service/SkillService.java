package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.SkillRequest;
import org.example.skillexchangenetwork.entity.Skill;
import org.example.skillexchangenetwork.entity.UserProfile;
import org.example.skillexchangenetwork.repository.SkillRepository;
import org.example.skillexchangenetwork.repository.UserProfileRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillService {
    private final SkillRepository skillRepository;
    private final UserProfileRepository userProfileRepository;

    public UserProfile addSkill(Long profileId, String skillName){
        UserProfile profile= userProfileRepository.findById(profileId)
                .orElseThrow(()->new RuntimeException("Profile not found with profileId "+profileId));
        Skill skill = skillRepository.findByName(skillName)
                .orElseGet(()->{
                    Skill skill1 = new Skill();
                    skill1.setName(skillName);
                    return skillRepository.save(skill1);
                });
        profile.getSkills().add(skill);
        return userProfileRepository.save(profile);
    }

    public List<Skill> getAllSkills(){
        return skillRepository.findAll();
    }

    public Skill getSkillById(Long id){
        return skillRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Skill not found with id "+id));
    }
    public Skill updateSkill(Long id, SkillRequest request){
        Skill skill = skillRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Skill not found with id "+id));
        Skill.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return skillRepository.save(skill);
    }

    public void deleteSkill(Long id){
        skillRepository.deleteById(id);
    }

    public UserProfile removeSkillFromProfile(Long profileId, Long skillId){
        UserProfile profile= userProfileRepository.findById(profileId)
                .orElseThrow(()->new RuntimeException("Profile not found with profileId "+profileId));
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(()->new RuntimeException("Skill not found with profileId "+skillId));
        profile.getSkills().remove(skill);
        return userProfileRepository.save(profile);
    }

}
