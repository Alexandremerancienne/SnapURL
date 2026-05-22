import { useEffect, useState } from "react";
import { getDashboardLinks } from "../../api/dashboard";
import { Search } from "lucide-react";
import UrlShortener from "../UrlShortener/UrlShortener";

export default function LinksTable() {
  const [links, setLinks] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchLinks = async () => {
      const data = await getDashboardLinks();
      setLinks(data.results);
    };

    fetchLinks();
  }, []);

  const handleCreateLink = () => {
    setShowModal(true);
  };

  const filteredLinks = Array.isArray(links)
    ? links.filter(
        (link) =>
          link.short_url.toLowerCase().includes(search.toLowerCase()) ||
          link.original_url.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <section className="links-table">
      <div className="links-table-header">
        <div className="links-table-header-left">
          <h2>My Links</h2>
        </div>

        <div className="links-table-header-right">
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />

            <input
              className="links-search"
              type="text"
              placeholder="Search links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="create-link-btn" onClick={handleCreateLink}>
            + Create New Link
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Short Link</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Create Date</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(filteredLinks) &&
            filteredLinks.map((link) => (
              <tr key={link.id}>
                <td className="table-link-blue">{link.short_url}</td>
                <td>{link.original_url}</td>
                <td>{link.hits_count}</td>
                <td>{new Date(link.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setShowModal(false)}>
              ×
            </button>

            <h2>Create New Link</h2>

            <UrlShortener
              onLinkCreated={(createdLink) => {
                setLinks((prev) => [
                  {
                    id: createdLink.id,
                    short_url: createdLink.short_url,
                    original_url: createdLink.original_url,
                    hits_count: createdLink.hits_count ?? 0,
                    created_at: createdLink.created_at,
                  },
                  ...(prev ?? []),
                ]);

                setShowModal(false);
              }}
            />
          </div>
        </div>
      )}
    </section>
  );
}
