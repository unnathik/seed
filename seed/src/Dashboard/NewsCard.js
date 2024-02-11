const NewsCard = ({ source, title, description, link, stock }) => {
    return (
      <div className="max-w-sm rounded overflow-hidden shadow-lg m-2 bg-white">
        <div className="px-6 py-4">
        <div className="font-semibold text-xs mb-2">{source}</div>
          <div className="font-weight-600 text-xl mb-2">{title}</div>
          <p className="text-gray-700 text-base">
            {description}
          </p>
        </div>
        <div className="px-6 pb-4 flex items-center justify-between">
        <button type="button" onClick={() => {
          navigateLink(link);
        }} className="text-white text-sm py-3 px-4 rounded-lg bg-[#050505] hover:bg-[#1C281E]/[0.8]">
              Read More
        </button>
        <p>
          {stock} <span className="text-stone-300">▶</span>
        </p>
        </div>
      </div>
    );
  };

  const navigateLink = (link) => {
    window.location.href = link
  }
  
  export default NewsCard;
  