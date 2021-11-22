import { useEffect, useState } from "react";
import ShowQR from "./ShowQR";

export default function Lecture({ match }) {
  const [lecture, setLecture] = useState();
  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER}/teacher/lectures/${match.params.id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt"),
        },
      }
    )
      .then((res) => res.json())
      .then((lec) => setLecture(lec));
  }, [match.params.id]);
  const deleteAttendance = (student_id) => {
    fetch(
      `${process.env.REACT_APP_BACKEND_SERVER}/teacher/lectures/${match.params.id}/${student_id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("jwt"),
        },
      }
    ).then(() => document.location.reload());
  };
  return (
    <div>
      {lecture && (
        <table className="table">
          <thead>
            <tr>
              <th>{lecture.lecture.subject}</th>
              <th>
                {new Date(Date.parse(lecture.lecture.start)).toLocaleString()}
              </th>
              <th>
                <ShowQR
                  index={match.params.id}
                  lecture={lecture.lecture.lecture}
                  code={lecture.lecture.code}
                />
              </th>
            </tr>
            <tr>
              <th colSpan={3} className="text-center">
                {lecture.lecture.lecture}
              </th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Roll</th>
            </tr>
          </thead>
          <tbody>
            {lecture.attendance.map((stud) => (
              <tr>
                <td>{stud.name}</td>
                <td>{stud.roll}</td>
                <td>
                  <span
                    onClick={() => deleteAttendance(stud.id)}
                    role="button"
                    className="text-primary"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
