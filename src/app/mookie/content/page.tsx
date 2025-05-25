import { getInitialFoldersAndEnsureRootAction } from "../actions/folderActions";
import MookieFolders from "./components/list/Folders";
import MookieContentListFooter from "./components/list/Footer";
import MookieListings from "./components/list/Listings";
import MookieSearchBar from "./components/list/SearchBar";

const MookieContent = async () => {
  console.time("MookieContent");
  const initialData = await getInitialFoldersAndEnsureRootAction();
  console.log("initialData", initialData);
  console.timeEnd("MookieContent");
  return (
    <div className="flex flex-row h-full">
      <div className="flex flex-col w-1/2 h-full">
        <div className="flex flex-col h-full">
          <div className="bg-gray-50 shadow-md h-[50px] flex px-2 items-center justify-between">
            <MookieSearchBar />
          </div>
          <div className="flex-grow h-[calc(100%-100px)] p-3">
            <MookieFolders initialData={initialData} />
          </div>
          <div className="bg-gray-50 h-[50px] flex px-2 items-center justify-between">
            <MookieContentListFooter />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-1/2 h-full">
        <MookieListings />
      </div>
    </div>
  );
};

export default MookieContent;
