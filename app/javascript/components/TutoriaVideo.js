import React from 'react';

const TutoriaVideo = ({w, h}) => (
  <div className='video-responsive'>
    <iframe 
      title='How to use Tutoria'
      width={ w } 
      height={ h }
      src="https://www.youtube.com/embed/SixpNhP7-Ng" 
      frameBorder="0" 
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
      allowFullScreen 
    />
  </div> 
);

export default TutoriaVideo;