// [neswId].js : " [] " tells dynamic page to nextjs or load for different values 

import { useRouter } from "next/router";

function DetailPage(){
    const router = useRouter();

    const newsId = router.query.newsId;
    //add the backend Api here
    return <h1>The Dynamic Page</h1>
}

export default DetailPage;