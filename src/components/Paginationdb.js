import React from "react";

const Paginationdb = ({ postsPerPage, totalPosts, paginatedb, loading }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <div>

      <nav>
        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li key={number} className="page-item">
              <a
                onClick={() => {
                  paginatedb(number);
                }}

                className="page-link text-dark"
              >
                <strong>{number} </strong>
              </a>
            </li>
          ))}
        </ul>
      </nav>

    </div>
  );
};

export default Paginationdb;
