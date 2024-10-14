// here rating array is the ratingAndReview array 



// consider ratingArr as an empty array by default if not value is provided 
// here rating array is the ratingAndReview array 


// empty is the default value 
export default function GetAvgRating(ratingArr = []){
    if(!Array.isArray(ratingArr) || ratingArr.length === 0)return 0;
    const totalReviewCount = ratingArr.reduce((acc,curr)=>{
        acc += curr.rating
        return acc;
    },0)
    const multiplier = Math.pow(10,1)
    const avgReviewCount = 
    Math.round((totalReviewCount/ ratingArr?.length) * multiplier)/ multiplier
    return avgReviewCount

}