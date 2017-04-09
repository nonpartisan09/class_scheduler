import React from 'react';

$.cloudinary.config({
  cloud_name: 'tutoria',
  api_key: '697813824695295',
  api_secret: 'AEb0cYHe6z0D0XAPag8NN_Jv9qQ',
});

const baseURL = 'http://res.cloudinary.com/tutoria/image/upload/';

export const upload = (file, cb) => {
};

export const Image = ({ publicId }) => (
	<img alt="" src={baseURL + publicId} />
);