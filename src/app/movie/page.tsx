import { Suspense } from 'react';
import {getMovieByCSFDId, getMovieById} from "@/db/movies";
import {Movie} from "@/lib/movies";
import {pullAndStoreFromCSFDId} from "@/actions/movies/pull-from-csfd";
import MovieCard from "@/components/movies/movie-card";

type PageProps = {
    searchParams: Promise<{
        id?: number;
        csfdId?: number;
        type?: string;
    }>;
};

const MovieDetail = async ({ id, type }: { id: number, type: string | null }) => {
    let databaseMovie: Movie | undefined

    if (type !== null) {
        databaseMovie = await getMovieByCSFDId(id)
        if (!databaseMovie) databaseMovie = await pullAndStoreFromCSFDId(id, type)
    } else {
        databaseMovie = await getMovieById(id)
    }

    if (!databaseMovie) {
        return <div>Movie not found</div>
    }

    return (
        <div className="container">
            <MovieCard movie={databaseMovie} />
        </div>
    );
};

export default async function MovieDetailWrapper({ searchParams }: PageProps) {

    const { csfdId, id, type } = await searchParams;

    const hasCsfd = !!csfdId;
    const hasId = !!id;

    if (hasCsfd === hasId) {
        return <div>Only one ID at time can be used</div>;
    }

    if (hasCsfd) {
        if (Number.isNaN(csfdId) || (type !== "series" && type !== "movie")) return <div>Invalid CSFDId or type</div>
        return (
            <div>
                <Suspense fallback="Movie detail is loading...">
                    <MovieDetail id={csfdId} type={type} />
                </Suspense>
            </div>
        );

    } else if (hasId){
        if (Number.isNaN(id)) return <div>Invalid id</div>
        return (
            <div>
                <Suspense fallback="Movie detail is loading...">
                    <MovieDetail id={id} type={null}/>
                </Suspense>
            </div>
        );
    } else {
        return <div>Something went wrong :c</div>
    }

}
