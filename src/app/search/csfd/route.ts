import { NextResponse } from 'next/server';
import { csfd } from 'node-csfd-api';
import {NewMovie} from "@/lib/movies";
import {addMovieToLocalDB} from "@/db/movies";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') ?? '';

    if (!query.trim()) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await csfd.search(query);
        return NextResponse.json({ results });
    } catch (error) {
        console.error('CSFD search error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from CSFD' },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
            csfdId,
            title,
            year,
            image,
            origins,
            type,
        } = body as NewMovie;

        const result = await csfd.movie(body.csfdId)

        if (!csfdId || !title) {
            return NextResponse.json(
                { error: 'Missing csfdId or title' },
                { status: 400 },
            );
        }

        const toUpload:NewMovie = {
            title,
            image: image,
            year,
            origins: origins ? origins[0] : "",
            csfdId: csfdId,
            csfdLastFetched: new Date().toISOString(),
            csfdRating: result.rating,
            type,
        }

        await addMovieToLocalDB(toUpload)

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (error) {
        console.error('DB insert error:', error);
        return NextResponse.json(
            { error: 'Failed to insert movie into local DB ' + error },
            { status: 500 },
        );
    }
}
