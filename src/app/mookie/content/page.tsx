import MookieContentListFooter from "./components/list/Footer";
import MookieListings from "./components/list/Listings";
import MookieSearchBar from "./components/list/SearchBar";

const MookieContent = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-50 shadow-md h-[50px] flex px-2 items-center justify-between">
        <MookieSearchBar />
      </div>
      <div className="flex-grow h-[calc(100%-100px)] p-3">
        <MookieListings />
      </div>
      <div className="bg-gray-50 h-[50px] flex px-2 items-center justify-between">
        <MookieContentListFooter />
      </div>
    </div>
  );
};

export default MookieContent;
