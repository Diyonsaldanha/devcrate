import Link from "next/link";

export default function NotFound() {
  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">404</div>
      <h1 className="empty-state-title">This page wandered off.</h1>
      <p className="empty-state-copy">We couldn’t find the page you were looking for.</p>
      <Link href="/" className="button-primary">
        Back to the good stuff
      </Link>
    </div>
  );
}
