import { Link } from 'react-router-dom';
export default function NotFoundPage() { return <section className="container page-head narrow"><p className="eyebrow">404</p><h1>Page not found.</h1><Link className="btn btn-primary" to="/">Back home</Link></section>; }
