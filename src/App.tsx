import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ListPage from "./pages/ListPage";
import GalleryPage from "./pages/GalleryPage";
import DetailPage from "./pages/DetailPage";
import { ResultsProvider } from "./context/ResultsContext";


const BASENAME = process.env.NODE_ENV === "production" ? "/mp2" : "/";

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
