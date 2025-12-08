import { Movie } from "@/lib/movies";
import { authOptions } from "@/auth";
import { getServerSession } from "next-auth/next";
import { isMovieWatchedBy, trackMovieVisit } from "@/db/movieVisits";
import {SeenStatusClient} from "@/components/movies/seen-status-client";

const MovieCard = async ({ movie }: { movie: Movie }) => {
    const csfdDateTime = movie.csfdLastFetched
        ? new Date(movie.csfdLastFetched).toLocaleDateString()
        : "";
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        return <div>Session invalid</div>;
    }
    const userEmail: string = session.user.email;

    await trackMovieVisit(userEmail, movie.id);

    const watched = await isMovieWatchedBy(userEmail, movie.id);
    const initialWatchedAt =
        !watched || watched.movieSeenAt === null ? null : watched.movieSeenAt;

    return (
        <div className="movie-card rounded-xl text-gray-300 bg-gray-900 px-5 py-6">
            <h1 className="mb-3.5 text-4xl font-bold">{movie.title}</h1>
            <div className="grid grid-cols-3">
                <section className="overflow-hidden">
                    <div className="w-full">
                        {movie.image ? <img src={movie.image} alt="cover" className="w-full h-full object-cover" /> : <img className="w-full h-full object-cover" src="https://static.vecteezy.com/system/resources/thumbnails/004/141/669/small/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg" alt="cover" />}
                    </div>
                </section>
                <section className="col-span-2 px-4">
                    <SeenStatusClient
                        userEmail={userEmail}
                        movieId={movie.id}
                        initialWatchedAt={initialWatchedAt}
                    />
                    <div className="capitalize py-1">{movie.type}</div>
                    <div className="py-1"><span className="font-bold">Genres:</span> {movie.genres}</div>
                    <div className="py-1"><span className="font-bold">Duration:</span> {movie.duration}</div>
                    <div className="py-1"><span className="font-bold">Origins:</span> {movie.origins}</div>
                    <div className="py-1"><span className="font-bold">CSFD Rating:</span> {movie.csfdRating}% <span className="text-xs">({csfdDateTime})</span></div>
                    <div className="py-1">{movie.description}</div>
                </section>
            </div>
        </div>
    );
};

export default MovieCard;
