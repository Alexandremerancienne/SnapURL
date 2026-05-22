import { useState } from "react";
import { Link, Zap } from "lucide-react";
import { createShortLink } from "../../api/home";

export default function UrlShortener({ setShortUrl }) {
  const [url, setUrl] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await createShortLink({
        original_url: url,
      });

      setShortUrl(data.short_url);
      setUrl("");
    } catch (err) {
      console.error("Error creating link:", err);
    }
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
