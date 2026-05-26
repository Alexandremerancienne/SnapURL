import { useEffect, useState } from "react";
import {
  getDashboardLinks,
  deleteDashboardLink,
  updateDashboardLink,
} from "../../api/dashboard";
import { Search, Pencil, Trash2, Copy, Check, X } from "lucide-react";
import UrlShortener from "../UrlShortener/UrlShortener";

export default function LinksTable() {
  const [links, setLinks] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [editingLinkId, setEditingLinkId] = useState(null);
  const [editingOriginalUrl, setEditingOriginalUrl] = useState("");
  const [savingLinkId, setSavingLinkId] = useState(null);

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

  const handleEdit = (link) => {
    setEditingLinkId(link.id);
    setEditingOriginalUrl(link.original_url);
  };

  const handleCancelEdit = () => {
    setEditingLinkId(null);
    setEditingOriginalUrl("");
  };

  const handleSaveEdit = async (linkId) => {
    const trimmedOriginalUrl = editingOriginalUrl.trim();

    if (!trimmedOriginalUrl) {
      window.alert("Original URL is required.");
      return;
    }

    setSavingLinkId(linkId);

    try {
      const updatedLink = await updateDashboardLink(linkId, {
        original_url: trimmedOriginalUrl,
      });

      setLinks((prev) =>
        prev.map((link) =>
          link.id === linkId
            ? {
                ...link,
                ...updatedLink,
                hits_count: updatedLink.hits_count ?? link.hits_count,
              }
            : link,
        ),
      );
      handleCancelEdit();
    } catch (error) {
      console.error("Error updating link:", error);
      window.alert("Could not update this link.");
    } finally {
      setSavingLinkId(null);
    }
  };

  const handleEditKeyDown = (event, linkId) => {
    if (event.key === "Enter") {
      handleSaveEdit(linkId);
    }

    if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  const handleDelete = async (linkId) => {
    const confirmDelete = window.confirm("Delete this link?");

    if (!confirmDelete) return;

    try {
      await deleteDashboardLink(linkId);

      setLinks((prev) => prev.filter((link) => link.id !== linkId));
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  const handleCopy = async (slug, id) => {
    try {
      await navigator.clipboard.writeText(slug);

      setCopiedId(id);

      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error(error);
    }
  };

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
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(filteredLinks) &&
            filteredLinks.map((link) => (
              <tr key={link.id}>
                <td className="table-link-blue table-actions">
                  {link.short_url}{" "}
                  <button onClick={() => handleCopy(link.slug, link.id)}>
                    <div className="copy-content">
                      <Copy size={18} />
                      {copiedId === link.id ? "Copied!" : ""}
                    </div>
                  </button>
                </td>
                <td>
                  {editingLinkId === link.id ? (
                    <input
                      className="inline-edit-input"
                      type="url"
                      value={editingOriginalUrl}
                      onChange={(e) => setEditingOriginalUrl(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, link.id)}
                      autoFocus
                    />
                  ) : (
                    link.original_url
                  )}
                </td>
                <td>{link.hits_count}</td>
                <td>{new Date(link.created_at).toLocaleDateString()}</td>
                <td className="table-actions">
                  {editingLinkId === link.id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(link.id)}
                        disabled={savingLinkId === link.id}
                        title="Save"
                      >
                        <Check size={18} color="green" />
                      </button>
                      <button onClick={handleCancelEdit} title="Cancel">
                        <X size={18} color="gray" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(link)} title="Edit">
                        <Pencil size={18} color="blue" />
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        title="Delete"
                      >
                        <Trash2 size={18} color="red" />
                      </button>
                    </>
                  )}
                </td>
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
