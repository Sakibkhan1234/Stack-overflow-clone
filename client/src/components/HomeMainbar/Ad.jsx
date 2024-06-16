import React from 'react';
import { faker } from '@faker-js/faker';
import './Questions.css';

const Ad = () => {
  return (
    <div className="ads-container">
      <a href="https://github.com/Sakibkhan1234?tab=repositories">
      <div className="ad-horizontal">
        <div className="ad-text">Ad</div>
        <img src={faker.image.business()} alt="business" />
        <img src={faker.image.city()} alt="city" />
        <img src={faker.image.food()} alt="food" />
        <img src={faker.image.nature()} alt="nature" />
        <img src={faker.image.sports()} alt="sports" />
      </div>
      </a>
    </div>
  );
};

export default Ad;

