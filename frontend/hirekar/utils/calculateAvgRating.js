export const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return "Not Rated";

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;
    return averageRating.toFixed(1); 
};