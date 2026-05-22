import { useState } from "react";
import { Check, QrCode, Copy } from "lucide-react";

export default function ResultBox({ shortUrl }) {
  const [copyText, setCopyText] = useState("");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyText("Copied!");
      setTimeout(() => setCopyText(""), 2000);
    } catch (error) {
      console.error("Failed to copy short URL:", error);
    }
  };

  return (
    <section className="result-box">
      <div className="result-validated">
        <Check size={30} className="nav-icon" />
      </div>

      <div className="divider"></div>

      <div className="result-content">
        <p>Your short URL</p>
        {shortUrl ? <p>{shortUrl}</p> : <p></p>}
        {shortUrl ? <p>Created just now</p> : <p></p>}
      </div>

      <div className="divider"></div>

      <div className="result-actions">
        <button className="result-item result-item-blue" onClick={handleCopy}>
          <Copy size={30} className="nav-icon" />
          {copyText ? "Copied!" : "Copy"}
        </button>

        <button className="result-item result-item-purple">
          <QrCode size={30} className="nav-icon" />
          QR Code
        </button>
      </div>
    </section>
  );
}
