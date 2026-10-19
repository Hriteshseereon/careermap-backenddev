import {
  createReview,
  getMentorReviews,
} from "./mentorReview.service.js";

export const createReviewController =
async (req, res) => {

  const result =
    await createReview(
      req.user.id,
      req.body
    );

  res
    .status(
      result.success
        ? 201
        : 400
    )
    .json(result);
};

export const getMentorReviewsController =
async (req, res) => {

  const result =
    await getMentorReviews(
      req.params.mentorId
    );

  res.json(result);
};