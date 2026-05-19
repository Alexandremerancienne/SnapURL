export default function LinksTable() {
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
          <tr>
            <td>snapurl.io/abc123</td>
            <td>https://youtube.com/watch?v=test</td>
            <td>124</td>
            <td>May 2026</td>
          </tr>

          <tr>
            <td>snapurl.io/react</td>
            <td>https://react.dev</td>
            <td>87</td>
            <td>May 2026</td>
          </tr>
        </tbody>
      </table>
    </section>
  );
}
