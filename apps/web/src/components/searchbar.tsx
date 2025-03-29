export default function searchBar() {
  return (
    <section>
      <div className="mt-5 flex items-center justify-center">
        <div>
          <input
            type="search"
            placeholder="Search product"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-96 p-2.5"
          />
        </div>
      </div>
    </section>
  );
}
