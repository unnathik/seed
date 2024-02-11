const NewsCard = ({ title, description, link }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2 bg-white">
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">
            {description}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Read More
          </button>
        </div>
      </div>
    );
  };
  
  export default NewsCard;
  