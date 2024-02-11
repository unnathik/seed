import React from 'react';
import NewsCard from './NewsCard';
import { newsData } from './NewsData';

const NewsFeed = () => {
  return (
    <div className='overflow-y-scroll'>
      {newsData.map((newsItem, index) => (
        <NewsCard
          key={index}
          title={newsItem.title}
          description={newsItem.description}
          link={newsItem.link}
        />
      ))}
    </div>
  );
};

export default NewsFeed;