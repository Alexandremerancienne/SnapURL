export default function PaginationComponent({
  items,
  itemsPerPage,
  currentPage,
  setCurrentPage,
}) {
  const totalPages = Math.ceil(items.length / itemsPerPage);

  return (
    <div className="pagination">
      <span className="pagination-info">
        Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
        {Math.min(currentPage * itemsPerPage, items.length)} of {items.length}{" "}
        links
      </span>

      <div className="pagination-buttons">
        <button
          className="pagination-button"
          disabled={currentPage === 1}
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
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
