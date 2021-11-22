import { useState } from "react";
import QRCode from "react-qr-code";

export default function NewLecture({ lecture, subject }) {
  const [code, setCode] = useState("");
  const newLecture = () => {
    if (lecture.length === 0) {
      alert("Lecture name cannot be empty");
      return;
    }
    fetch(`${process.env.REACT_APP_BACKEND_SERVER}/lecture`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        lecture: {
          name: lecture,
          start: new Date(Date.now() + 19800000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
          subject: subject,
        },
      }),
    })
      .then((res) => res.text())
      .then((code) => setCode(code))
      .then(() => (document.getElementById("lectureName").value = ""))
      .then(() => document.getElementById("toggleModal").click());
  };
  return (
    <div className="col-auto">
      <button type="button" className="btn btn-primary" onClick={newLecture}>
        New Lecture
      </button>
      <button
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
        className="invisible"
        id="toggleModal"
      />

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModal-Label">
                {lecture}
              </h5>
              <button
                type="button"
                onClick={() => document.location.reload()}
                className="btn-close"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <QRCode value={`attendance ${code}`} size={512} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
