import QRCode from "react-qr-code";

export default function ShowQR({ index, lecture, code }) {
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target={`#exampleModal-${index}`}
      >
        Show QR
      </button>

      <div
        className="modal fade"
        id={`exampleModal-${index}`}
        tabIndex="-1"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`exampleModal-${index}-Label`}>
                {lecture}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
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
