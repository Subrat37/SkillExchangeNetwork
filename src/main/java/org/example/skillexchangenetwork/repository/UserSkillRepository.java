package org.example.skillexchangenetwork.repository;

import org.example.skillexchangenetwork.entity.UserSkill;
import org.example.skillexchangenetwork.enums.SkillType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSkillRepository
        extends JpaRepository<UserSkill, Long> {

    List<UserSkill> findBySkillType(SkillType skillType);

    List<UserSkill> findByUserId(Long userId);
}