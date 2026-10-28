package org.example.skillexchangenetwork.dto;

import lombok.*;
import org.example.skillexchangenetwork.enums.ExperienceLevel;
import org.example.skillexchangenetwork.enums.SkillType;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserSkillRequest {
    private Long skillId;
    private SkillType type;
    private ExperienceLevel level;
    private Long userId;
}
