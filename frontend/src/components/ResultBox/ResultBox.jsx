import { useRef, useState } from "react";
import { Check, QrCode, Copy } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export default function ResultBox({ shortUrl }) {
  const [copyText, setCopyText] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);

  const qrRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopyText("Copied!");
      setTimeout(() => setCopyText(""), 2000);
    } catch (error) {
      console.error("Failed to copy short URL:", error);
    }
  };

  const handleQrCode = () => {
    setShowQrCode((prev) => !prev);
  };

  const handleDownloadQr = () => {
    const svg = qrRef.current.querySelector("svg");
    const svgData = new XMLSerializer().serializeToString(svg);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const img = new Image();

    const svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8",
    });

    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      URL.revokeObjectURL(url);

      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngFile;
      downloadLink.download = "qr-code.png";
      downloadLink.click();
    };

    img.src = url;
  };

  return (
    <>
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

          <button
            className="result-item result-item-purple"
            onClick={handleQrCode}
          >
            <QrCode size={30} className="nav-icon" />
            {showQrCode ? "Hide QR" : "QR Code"}
          </button>
        </div>
      </section>

      {showQrCode && shortUrl && (
        <div className="qr-wrapper">
          <div ref={qrRef} className="qr-code">
            <QRCodeSVG value={shortUrl} />
          </div>

          <button onClick={handleDownloadQr}>Download QR</button>
        </div>
      )}
    </>
  );
}
