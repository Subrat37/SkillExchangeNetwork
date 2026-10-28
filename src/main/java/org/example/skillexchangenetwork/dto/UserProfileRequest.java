package org.example.skillexchangenetwork.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileRequest {
    private String bio;
    private String city;
    private boolean available;
    private String profilePhoto;
}
