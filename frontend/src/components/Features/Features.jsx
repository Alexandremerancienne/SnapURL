import { ShieldCheck, ChartNoAxesCombined, Link2 } from "lucide-react";

export default function Features() {
  return (
    <section className="features">
      <div className="feature">
        <div className="icon-box blue">
          <ChartNoAxesCombined size={30} />
        </div>
        <div>
          <h5>Track Performance</h5>
          <p>Monitor clicks and engagement</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="feature">
        <div className="icon-box purple">
          <Link2 size={30} className="rotate-icon" />
        </div>
        <div>
          <h5>Manage Easily</h5>
          <p>Organize and edit your links</p>
        </div>
      </div>

      <div className="divider"></div>

      <div className="feature">
        <div className="icon-box green">
          <ShieldCheck size={30} />
        </div>
        <div>
          <h5>Share with Confidence</h5>
          <p>Secure, reliable, and fast</p>
        </div>
      </div>
    </section>
  );
}
