"use client";

import { useState } from "react";
import { StarSelector } from "@/components/star-selector";
import { createReviewAction } from "@/app/actions/reviews";
import { useToast } from "@/components/ui/toast-provider";

type Review = {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: { full_name?: string } | null;
};

type Props = {
  productId: string;
  reviews: Review[];
  avgRating: number;
};

export function ReviewSection({ productId, reviews: initialReviews, avgRating }: Props) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState(initialReviews);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      showToast("Please select a star rating.", "error");
      return;
    }

    setSubmitting(true);
    const result = await createReviewAction({ product_id: productId, rating, comment });
    setSubmitting(false);

    if (result.error) {
      showToast(result.error, "error");
      return;
    }

    showToast("Review submitted!", "success");
    setRating(0);
    setComment("");
    window.location.reload();
  }

  return (
    <section className="sec review-section">
      <h2 className="section-title">Customer Reviews</h2>

      <form className="review-form" onSubmit={handleSubmit}>
        <h3 className="review-form-title">Write a Review</h3>
        <div className="review-form-stars">
          <StarSelector value={rating} onChange={setRating} />
        </div>
        <textarea
          className="fi"
          rows={3}
          placeholder="Share your thoughts about this product..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button type="submit" className="btn btn-amber" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>

      <div className="review-list">
        {reviews.length === 0 ? (
          <p className="review-empty">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <span className="star-rating-display">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`star ${star <= review.rating ? "star-filled" : "star-empty"}`}>
                      {star <= review.rating ? "\u2605" : "\u2606"}
                    </span>
                  ))}
                </span>
                <span className="review-author">{review.profiles?.full_name ?? "Anonymous"}</span>
                <span className="review-date">
                  {new Date(review.created_at).toLocaleDateString("en-PH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric"
                  })}
                </span>
              </div>
              {review.comment && <p className="review-comment">{review.comment}</p>}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
