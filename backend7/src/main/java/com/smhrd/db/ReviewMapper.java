package com.smhrd.db;

import java.util.List;
import com.smhrd.model.ReviewDTO;

public interface ReviewMapper {
    public int insertReview(ReviewDTO dto);
    public List<ReviewDTO> getAllReviews();
    public ReviewDTO getReviewById(int review_idx);
}
