export default function PaginationComponent({
  items,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) {
  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasItems = totalItems > 0;
  const startItem = hasItems ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = hasItems
    ? Math.min(currentPage * itemsPerPage, totalItems)
    : 0;

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {startItem} to {endItem} of {totalItems} links
      </span>

      <div className="pagination-buttons">
        <button
          className="pagination-button"
          disabled={!hasItems || currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          {"<"}
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return page <= 2 || page === totalPages ? (
            <button
              key={index}
              className={
                currentPage === page
                  ? "pagination-button-active"
                  : "pagination-button"
              }
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ) : page === 3 ? (
            <span key={index}>...</span>
          ) : null;
        })}

        <button
          className="pagination-button"
          disabled={!hasItems || currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
