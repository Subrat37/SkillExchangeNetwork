package org.example.skillexchangenetwork.repository;

import org.example.skillexchangenetwork.entity.Message;
import org.example.skillexchangenetwork.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("""
    SELECT m FROM Message m
    WHERE (m.sender.id = :user1 AND m.receiver.id = :user2)
       OR (m.sender.id = :user2 AND m.receiver.id = :user1)
    ORDER BY m.sendAt ASC
""")
    List<Review> findConversation(
            @Param("user1") Long user1,
            @Param("user2") Long user2
    );

    List<Review> reviewer_id(Long userId);
    List<Review> findByReviewedUser_Id(Long userId);
}
