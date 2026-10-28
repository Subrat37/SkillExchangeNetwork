package org.example.skillexchangenetwork.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewRequest {
    private Long reviewer_id;
    private Long reviewed_user_id;
    private Long rating;
    private String comment;
}
