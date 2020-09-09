import React from "react";

const Posts = ({ matchs, loading, noMatchs }) => {
  // const ballon = matchs.map((match, index) => {
  //   console.log(match);
  // });
  console.log(matchs);

  if (loading) {
    return <h2>Loading...</h2>;
  }
  if (noMatchs) {
    return <h2>scraping faild or no match in this day !!!</h2>;
  }
  return matchs.length == 0 ? (
    ""
  ) : (
      <div>
        <table className="table table-dark text-center">
          <thead>
            <tr >
              <th scope="col">Match</th>
              <th scope="col">Bs</th>
              <th scope="col">1</th>
              <th scope="col">X</th>
              <th scope="col">2</th>
            </tr>
          </thead>
          <tbody>
            {matchs.map((match, index) => {
              return (
                <tr key={index}>
                  <td>{match.match}</td>
                  <td>{match.bs}</td>
                  <td>{match.one}</td>
                  <td>{match.x}</td>
                  <td>{match.two}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
};

export default Posts;
