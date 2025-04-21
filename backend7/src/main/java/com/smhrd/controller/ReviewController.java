package com.smhrd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.smhrd.db.ReviewMapper;
import com.smhrd.model.ReviewDTO;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private ReviewMapper reviewMapper;

    @PostMapping("/write")
    public String writeReview(@RequestBody ReviewDTO dto) {
        int result = reviewMapper.insertReview(dto);
        return result == 1 ? "success" : "fail";
    }

    @GetMapping("/list")
    public List<ReviewDTO> getAllReviews() {
        return reviewMapper.getAllReviews();
    }

    @GetMapping("/detail/{id}")
    public ReviewDTO getReview(@PathVariable("id") int id) {
        return reviewMapper.getReviewById(id);
    }
}
