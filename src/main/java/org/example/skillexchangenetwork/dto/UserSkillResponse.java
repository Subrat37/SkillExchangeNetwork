package org.example.skillexchangenetwork.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UserSkillResponse {

    private Long id;
    private SkillInfo skill;
    private String skillType;
    private String experience;
    private UserInfo user;

    @Getter
    @AllArgsConstructor
    public static class SkillInfo {
        private Long id;
        private String name;
        private String description;
    }

    @Getter
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String name;
        private String email;
    }
}