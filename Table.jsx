function Table({ subjects, getGrade }) {
  let totalCredits = 0;
  let totalCreditPoints = 0;
  let totalMarks = 0;

  const rows = subjects.map((subject, index) => {
    const ica = Number(subject.ica);
    const ese = Number(subject.ese);
    const credits = Number(subject.credits);

    const total = ica + ese;
    const result = getGrade(total);
    const creditPoints = credits * result.point;

    totalCredits += credits;
    totalCreditPoints += creditPoints;
    totalMarks += total;

    return {
      ...subject,
      index,
      ica,
      ese,
      credits,
      total,
      grade: result.grade,
      point: result.point,
      creditPoints
    };
  });

  const sgpa =
    totalCredits > 0
      ? (totalCreditPoints / totalCredits).toFixed(2)
      : "0.00";

  return (
    <div className="table-container">

      <table className="marksheet-table">

        <thead>
          <tr>
            <th>Sr.</th>
            <th>Subject</th>
            <th>Credits</th>
            <th>ICA</th>
            <th>ESE</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Grade Point</th>
            <th>C × G</th>
          </tr>
        </thead>

        <tbody>

          {rows.length === 0 ? (

            <tr>
              <td
                colSpan="9"
                className="empty-row"
              >
                No subjects available
              </td>
            </tr>

          ) : (

            rows.map((subject) => (
              <tr key={subject.index}>

                <td>
                  {subject.index + 1}
                </td>

                <td>
                  {subject.name}
                </td>

                <td>
                  {subject.credits}
                </td>

                <td>
                  {subject.ica}
                </td>

                <td>
                  {subject.ese}
                </td>

                <td>
                  {subject.total}
                </td>

                <td>
                  {subject.grade}
                </td>

                <td>
                  {subject.point}
                </td>

                <td>
                  {subject.creditPoints}
                </td>

              </tr>
            ))

          )}

          {rows.length > 0 && (

            <tr className="total-row">

              <td colSpan="2">
                <strong>Total</strong>
              </td>

              <td>
                <strong>
                  {totalCredits}
                </strong>
              </td>

              <td>-</td>

              <td>-</td>

              <td>
                <strong>
                  {totalMarks}
                </strong>
              </td>

              <td>-</td>

              <td>-</td>

              <td>
                <strong>
                  {totalCreditPoints}
                </strong>
              </td>

            </tr>

          )}

        </tbody>

      </table>

      <div className="sgpa-box">
        <span>SGPA</span>

        <strong>
          {sgpa}
        </strong>
      </div>

    </div>
  );
}

export default Table;