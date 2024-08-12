import { BookIcon } from "lucide-react";

const SetCard = ({ set,onclick}) => {
  return (
    <div className="bg-dark-bg-sec p-6 rounded-lg shadow-lg max-w-sm w-full hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center gap-4 mb-4">
        <BookIcon className="w-10 h-10 text-blue-500" />
        <h3 className="text-2xl font-bold text-gray-200">{set.setName}</h3>
      </div>
      <p className="text-gray-400 mb-6">{set.description}</p>
      <button
        onClick={onclick}
        className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-300"
      >
        View Set
      </button>
    </div>
  );
};

export default SetCard;
