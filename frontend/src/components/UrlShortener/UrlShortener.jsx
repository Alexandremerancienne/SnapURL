import { useState } from "react";
import { Link, Zap } from "lucide-react";

export default function UrlShortener() {
  const [url, setUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("URL:", url);
  };

  return (
    <section className="url-box">
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-wrapper">
          <Link size={18} className="input-icon" />
          <input
            type="url"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>

        <button type="submit" className="btn">
          <Zap size={16} className="btn-icon" />
          Shorten
        </button>
      </form>
    </section>
  );
}
