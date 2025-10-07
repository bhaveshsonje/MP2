import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ListPage from "./pages/ListPage";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import { ResultsProvider } from "./context/ResultsContext";


function computeBasename() {
  if (process.env.NODE_ENV !== "production") return "/";
  const pub = process.env.PUBLIC_URL || ""; 
  try {
    const u = new URL(pub);
    return u.pathname.endsWith("/") ? u.pathname.slice(0, -1) : u.pathname || "/";
  } catch {
    const p = pub.startsWith("/") ? pub : `/${pub}`;
    return p.endsWith("/") ? p.slice(0, -1) : p;
  }
}
const BASENAME = computeBasename();

function App() {
  return (
    <BrowserRouter basename={BASENAME}>
      <ResultsProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ListPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
            <Route path="/meal/:id" element={<DetailPage />} />
            <Route path="*" element={<ListPage />} />
          </Route>
        </Routes>
      </ResultsProvider>
    </BrowserRouter>
  );
}

export default App;
