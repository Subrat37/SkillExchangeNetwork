package org.example.skillexchangenetwork.controller;

import lombok.RequiredArgsConstructor;
import org.example.skillexchangenetwork.dto.ReviewRequest;
import org.example.skillexchangenetwork.entity.Review;
import org.example.skillexchangenetwork.service.ReviewService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/review")
@CrossOrigin(origins = "http://127.0.0.1:5500")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @PostMapping("/create")
    public ResponseEntity<Review> createReview(@RequestBody ReviewRequest request){
        return ResponseEntity.ok(reviewService.createReview(request));
    }
    @GetMapping("/getconvarsation/{reviewerId}/{reviewedUserId}")
    public ResponseEntity<List<Review>> getConversation(@PathVariable Long reviewerId, @PathVariable Long reviewedUserId){
        return ResponseEntity.ok(reviewService.getConversation(reviewerId,reviewedUserId));
    }
    @GetMapping("{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long reviewId){
        return ResponseEntity.ok(reviewService.getReviewById(reviewId));
    }
    @GetMapping
    public ResponseEntity<List<Review>> getAllReview(){
        return ResponseEntity.ok(reviewService.getAllReviews());
    }
    @GetMapping("/getreviews/{reviewedUserId}")
    public ResponseEntity<List<Review>> getReviewsForUser(@PathVariable Long reviewedUserId){
        return ResponseEntity.ok(reviewService.findByReviewedUser_Id(reviewedUserId));
    }
    @GetMapping("/getreviews/{reviewerId}")
    public ResponseEntity<List<Review>> getReviewsByReviewer(@PathVariable Long reviewerId){
        return ResponseEntity.ok(reviewService.reviewer_id(reviewerId));
    }
    @GetMapping("/averageRating/{userId}")
    public Double getAverageRating(@PathVariable Long userId){
        return reviewService.getAverageRating(userId);
    }
}
