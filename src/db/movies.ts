import {Movie, NewMovie} from "@/lib/movies";
import {db} from "@/db/index";
import {movies} from "@/db/schema";
import {csfd} from "node-csfd-api";
import {eq} from "drizzle-orm";


export const addMovieToLocalDB = async (movie: NewMovie) => {
    return db.insert(movies).values(movie);
}

export const autoUpdateMovieRatings = async (movie: Movie) => {
    if (!isWithinLast24Hours(movie.csfdLastFetched)) {
        const updatedResult = await csfd.movie(movie.csfdId)

        await db.update(movies).set({
            csfdRating: updatedResult.rating,
            csfdLastFetched: new Date().toISOString(),
        }).where(eq(movies.id, movie.id))
    }

    if(isWithinLast24Hours(movie.tmdbLastFetched)) {
        // todo fetch for TMDB
    }
}

function isWithinLast24Hours(value: string | null): boolean {
    if (!value) return false;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return false;

    const cutoff = Date.now() - 24 * 60 * 60 * 1000;

    return date.getTime() >= cutoff;
}