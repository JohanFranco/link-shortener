import type { APIRoute } from "astro";
import {db, Links, eq} from 'astro:db';
import { v6 as uuidv6 } from 'uuid';

export const POST: APIRoute = async ({ request })  => {
    const reqUrl = new URL(request.url);
    const baseUrl = `${reqUrl.protocol}//${reqUrl.host}/`; 

    if (request.headers.get("Content-Type") === "application/json") {
        let originalUrl = "";
        let shorteName = "";
        const body = await request.json();
        originalUrl = body.originalUrl.toString();

        if(!originalUrl)
            return new Response("Url is required", { status: 400 });

            const url = await db.select().from(Links).where(
                eq( Links.originalLink , originalUrl)
                );

            if(url.length > 0){
                const shortedDb = url[0].shortedLink;
                return new Response(
                    JSON.stringify({
                      url: baseUrl + shortedDb
                    })
                )
            }

        shorteName = (await generateShortedName()).toString()
        console.log(shorteName);
        await db.insert(Links).values({ originalLink: originalUrl, shortedLink: shorteName});

    
        return new Response(
            JSON.stringify({
              url: baseUrl + shorteName
            })
        );
      }
      return new Response( "Invalid content type" , { status: 400 });
}


const generateShortedName = async (): Promise<string> => {
    const shortedLink = (uuidv6().toString()).substring(0, 5);
    const dbName = await db.select().from(Links).where(
        eq( Links.shortedLink , shortedLink)
    )

    if(dbName.length === 0)
        return shortedLink;

    if (shortedLink !== dbName[0]?.shortedLink) {
        return shortedLink;
    } else {
        return generateShortedName();
    }
}
