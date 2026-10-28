package org.example.skillexchangenetwork.entity;

import jakarta.persistence.*;
import lombok.*;
import org.example.skillexchangenetwork.enums.ExperienceLevel;
import org.example.skillexchangenetwork.enums.SkillType;
import org.hibernate.sql.results.graph.Fetch;

@Entity
@Table(name = "UserSkills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkill {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Enumerated(EnumType.STRING)
    private SkillType skillType;

    @Enumerated(EnumType.STRING)
    private ExperienceLevel experience;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
