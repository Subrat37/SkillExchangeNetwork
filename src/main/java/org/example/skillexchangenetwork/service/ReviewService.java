package org.example.skillexchangenetwork.service;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.ReviewRequest;
import org.example.skillexchangenetwork.entity.Message;
import org.example.skillexchangenetwork.entity.Review;
import org.example.skillexchangenetwork.entity.User;
import org.example.skillexchangenetwork.repository.ReviewRepository;
import org.example.skillexchangenetwork.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public Review createReview(ReviewRequest request){
        User reviewer = userRepository.findById(request.getReviewer_id())
                .orElseThrow(()->new RuntimeException("Reviewer is not found"));
        User reviewedUser = userRepository.findById(request.getReviewed_user_id())
                .orElseThrow(()->new RuntimeException("ReviewedUser is not found"));
        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewedUser(reviewedUser)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        return reviewRepository.save(review);
    }
    public List<Review> getConversation(Long reviewerId, Long reviewedUserId){
        return reviewRepository.findConversation(reviewerId,reviewedUserId);
    }
    public Review getReviewById(Long reviewId){
        return reviewRepository.findById(reviewId)
                .orElseThrow(()->new RuntimeException("Review not found by id "+reviewId));
    }
    public List<Review> getAllReviews(){
        return reviewRepository.findAll();
    }

    // Get reviews received by a user
    public List<Review> findByReviewedUser_Id(Long reviewedUserId){
        return reviewRepository.findByReviewedUser_Id(reviewedUserId);
    }

    // Get reviews written by a user
    public List<Review> reviewer_id(Long reviewerId){
        return reviewRepository.reviewer_id(reviewerId);
    }

    // Calculate average rating for a user
    public Double getAverageRating(Long userId){
        List<Review> reviews = reviewRepository.findByReviewedUser_Id(userId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        double total = 0;
        for (Review review: reviews){
            total += review.getRating();
        }
        return total/reviews.size();
    }
}
