import React from "react";

const Pagination = ({ postsPerPage, totalPosts, paginate, loading }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>
      {loading ? (
        ""
      ) : (
          <nav>
            <ul className="pagination">
              {pageNumbers.map((number) => (
                <li key={number} className="page-item">
                  <a
                    onClick={() => {
                      paginate(number);
                    }}
                    href="#"
                    className="page-link text-dark"
                  >
                    <strong>{number} </strong>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
    </div>
  );
};

export default Pagination;
