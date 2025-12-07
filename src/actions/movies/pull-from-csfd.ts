import {csfd} from "node-csfd-api";
import {Movie, type NewMovie} from "@/lib/movies";
import {addMovieToLocalDB} from "@/db/movies";

export const pullAndStoreFromCSFDId = async (
    csfdId: number,
    type: string
): Promise<Movie | undefined> => {
    const csfdPull = await csfd.movie(csfdId)

    if (!csfdPull) return undefined;

    const {title, poster, year, origins, rating, descriptions, genres, duration } = csfdPull;

    const toUpload: NewMovie = {
        title,
        image: poster,
        duration: duration.toString(),
        genres: genres.join(','),
        year,
        description: descriptions ? descriptions[0] : null,
        origins: origins ? origins[0] : '',
        csfdId,
        csfdLastFetched: new Date().toISOString(),
        csfdRating: rating,
        type
    };


    return await addMovieToLocalDB(toUpload);
}