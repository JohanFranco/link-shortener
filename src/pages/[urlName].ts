import type { APIRoute } from "astro";
import {db, Links, eq} from 'astro:db';

export const GET: APIRoute = async ({ params, redirect  }) => {    
    const urlName = params.urlName ?? "";

    const url = await db.select().from(Links).where(
        eq( Links.shortedLink , urlName)
    );

    if(url.length === 0 || url[0]?.originalLink === "")
        return new Response("Url Not Found", { status: 404 });

    return redirect(url[0]?.originalLink, 307);
}