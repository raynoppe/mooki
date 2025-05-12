"use client";
import PagesZone from "../components/contentmenu/zones/PagesZone";
import VideosZone from "../components/contentmenu/zones/VideosZone";

const ContentPage = () => {
  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 h-full">
      <PagesZone />
      <VideosZone />
    </div>
  );
};

export default ContentPage;
