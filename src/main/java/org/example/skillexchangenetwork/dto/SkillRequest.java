package org.example.skillexchangenetwork.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SkillRequest {
    private String name;
    private String description;
}
