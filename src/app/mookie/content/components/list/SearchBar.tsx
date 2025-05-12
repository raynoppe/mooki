const MookieSearchBar = () => {
  return (
    <>
      <form action="" className="flex items-center gap-2">
        <input
          type="text"
          className="rounded-md border-1 border-gray-300 px-2 py-1 bg-white"
        />
        <button
          type="submit"
          className="rounded-md bg-blue-500 text-white px-2 py-1"
        >
          Search
        </button>
      </form>
      <div>
        <button className="rounded-md bg-blue-500 text-white px-2 py-1">
          Create
        </button>
      </div>
    </>
  );
};

export default MookieSearchBar;
