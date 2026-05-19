import { useEffect, useState } from "react";
import { getDashboardLinks } from "../../api/dashboard";

export default function LinksTable() {
  const [links, setLinks] = useState(null);

  useEffect(() => {
    const fetchLinks = async () => {
      const data = await getDashboardLinks();
      setLinks(data.results);
    };

    fetchLinks();
  }, []);

  return (
    <section className="links-table">
      <div className="links-table-header">
        <h2>My Links</h2>
      </div>

      <table>
        <thead>
          <tr>
            <th>Short Link</th>
            <th>Original URL</th>
            <th>Clicks</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(links) &&
            links.map((link) => (
              <tr key={link.id}>
                <td>{link.short_url}</td>
                <td>{link.original_url}</td>
                <td>{link.hits_count}</td>
                <td>{new Date(link.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  );
}
