export default function LoadingScreen({ message = 'Preparing your workspace…' }) {
  return <main className="loading-screen"><span className="spinner" /><p>{message}</p></main>;
}
