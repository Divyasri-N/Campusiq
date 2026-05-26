import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import ListingPage from "./pages/ListingPage";
import DetailPage from "./pages/DetailPage";
import ComparePage from "./pages/ComparePage";
import PredictorPage from "./pages/PredictorPage";

import Navbar from "./components/Navbar";

function App() {
  // ← fixed: string[] instead of number[]
  const [compareList, setCompareList] = useState<string[]>([]);

  const navigate = useNavigate();

  // ← fixed: id is string (_id from MongoDB)
  const handleView = (id: string) => {
    navigate(`/college/${id}`);
  };

  // ← fixed: id is string (_id from MongoDB)
  const handleToggleCompare = (id: string) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((cid) => cid !== id)
        : prev.length >= 3
        ? prev // max 3 colleges
        : [...prev, id]
    );
  };

  const handleGoCompare = () => {
    navigate("/compare");
  };

  return (
    <div>
      {/* NAVBAR */}
      <Navbar />

      {/* ROUTES */}
      <Routes>
        {/* Listing Page */}
        <Route
          path="/"
          element={
            <ListingPage
              onView={handleView}
              compareList={compareList}
              onToggleCompare={handleToggleCompare}
              onGoCompare={handleGoCompare}
            />
          }
        />

        {/* Detail Page */}
        <Route path="/college/:id" element={<DetailPage />} />

        {/* Compare Page */}
        <Route
          path="/compare"
          element={<ComparePage compareList={compareList} />}
        />

        {/* Predictor Page */}
        <Route path="/predictor" element={<PredictorPage />} />
      </Routes>
    </div>
  );
}

export default App;