import { Check, QrCode, Copy } from "lucide-react";

export default function ResultBox() {
  return (
    <section className="result-box">
      <div className="result-validated">
        <Check size={30} className="nav-icon" />
      </div>

      <div className="divider"></div>

      <div className="result-content">
        <p>Your short URL</p>
      </div>

      <div className="divider"></div>

      <div className="result-actions">
        <button className="result-item result-item-blue">
          <Copy size={30} className="nav-icon" />
          Copy
        </button>

        <button className="result-item result-item-purple">
          <QrCode size={30} className="nav-icon" />
          QR Code
        </button>
      </div>
    </section>
  );
}
