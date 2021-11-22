import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NewLecture from "./NewLecture";
import ShowQR from "./ShowQR";

export default function Lectures() {
  const [lecture, setLecture] = useState("");
  const [lectures, setLectures] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState(0);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/teacher/lectures`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((r) => {
        setLectures(r.lectures);
        setSubjects(
          r.subjects.map((sub) => {
            return {
              subject_id: sub.subject_id,
              subject: `${sub.subject}`,
            };
          })
        );
        setSubject(r.subjects[0].subject_id);
      });
  }, []);
  const deleteLecture = (lecture_id) => {
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/lecture/${lecture_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
    }).then(() => document.location.reload());
  };
  return (
    <div className="container p-5">
      <div className="row mb-5">
        <div className="col-3">
          <select
            name="subjects"
            className="form-select"
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((sub, index) => (
              <option value={sub.subject_id}>{sub.subject}</option>
            ))}
          </select>
        </div>
        <div className="col">
          <input
            id="lectureName"
            type="text"
            className="form-control"
            placeholder="lecture on harmonic motion"
            onChange={(e) => setLecture(e.target.value)}
          />
        </div>
        <NewLecture lecture={lecture} subject={subject} />
      </div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Subject</th>
            <th scope="col">Lecture</th>
            <th scope="col">Start</th>
            <th scope="col">Code</th>
          </tr>
        </thead>
        <tbody>
          {lectures.map((lec, index) => (
            <tr key={index}>
              <td>{lec.subject}</td>
              <td>{lec.lecture}</td>
              <td>{new Date(Date.parse(lec.start)).toLocaleString()}</td>
              <td>
                <ShowQR index={index} lecture={lec.lecture} code={lec.code} />
              </td>
              <td>
                <Link
                  to={`/lectures/${lec.lecture_id}`}
                  className="text-decoration-none"
                >
                  View
                </Link>
              </td>
              <td>
                <span
                  onClick={() => {
                    deleteLecture(lec.lecture_id);
                  }}
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
    </div>
  );
}
