import React from "react";
import {motion} from 'framer-motion';

const MoiveCard = ({
  movie: { title, vote_average, poster_path, release_date, original_language },
}) => {
  return (
    <>
      <motion.div 
      initial={{ opacity: 1 }}
      animate={{ opacity: 2 }}
      whileHover={{ scale: 1.1 }}
      exit={{ opacity: 1 }}
      whileTap={{ scale: 0.95 }}
      
      className="movie-card">
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : `/no-movie.png`
          }
          alt={title}
        />
        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
             <div className="rating">
                <img src="star.jpeg" alt="star-icon" />
                <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
             </div>
                  <span>●</span>
                  <p className="lang">{original_language}</p>
                  <span>●</span>
                  <p className="year">{release_date ? release_date.split('-')[0]:'N/A'}</p>
            </div>
        </div>

      </motion.div>
    </>
  );
};

export default MoiveCard;