package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.SkillRequest;
import org.example.skillexchangenetwork.entity.Skill;
import org.example.skillexchangenetwork.entity.UserProfile;
import org.example.skillexchangenetwork.service.SkillService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class SkillController {
    private final SkillService skillService;

    @PostMapping("/add/{profileId}")
    public ResponseEntity<UserProfile> addSkill(@PathVariable Long profileId, @RequestBody String skillName){
        return ResponseEntity.ok(skillService.addSkill(profileId,skillName));
    }
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkill(){
        return ResponseEntity.ok(skillService.getAllSkills());
    }
    @GetMapping("{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id){
        return ResponseEntity.ok(skillService.getSkillById(id));
    }
    @PutMapping("/update/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody SkillRequest request){
        return ResponseEntity.ok(skillService.updateSkill(id,request));
    }
    @DeleteMapping("/delete/{id}")
    public void deleteSkill(@PathVariable Long id){
        skillService.deleteSkill(id);
    }
    @DeleteMapping("/delete/{profileId}/{skillId}")
    public ResponseEntity<UserProfile> removeSkillFromProfile(@PathVariable Long profileId, @PathVariable Long skillId){
        return ResponseEntity.ok(skillService.removeSkillFromProfile(profileId,skillId));
    }
}
