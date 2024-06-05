import { ContentList } from "@agility/content-fetch"
import getAgilitySDK from "lib/cms/getAgilitySDK"
import { getPostListing } from "lib/cms-content/getPostListing"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams

    const locale = searchParams.get('locale')
    const sitemap = searchParams.get('sitemap')

    const skip = Number(searchParams.get('skip'))
    const take = Number(searchParams.get('take'))

    if (!locale || !sitemap || isNaN(skip) || skip < 1 || isNaN(take) || take < 1) {
        return new Response('Invalid request: skip, take, locale, and sitemap are all required', {
            status: 400
        });
    }

    // Fetch the post listing with pagination
    const postsRes = await getPostListing({ sitemap: sitemap, locale, skip, take })

    // Calculate the correct contentID for each post
    postsRes.posts = postsRes.posts.map((post, index) => {
        // Parse ContentID to ensure it's a number
        const contentID = parseInt(post.ContentID);
        if (!isNaN(contentID)) {
            post.contentID = contentID + skip;
        }
        return post;
    });

    return new Response(JSON.stringify(postsRes.posts))
}
