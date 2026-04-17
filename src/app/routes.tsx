import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Papers from "./pages/Papers";
import PaperDetail from "./pages/PaperDetail";
import Tutor from "./pages/Tutor";
import Patterns from "./pages/Patterns";
import Generate from "./pages/Generate";

function NotFound() {
  return (
    <div className="flex items-center justify-center h-full text-center p-8">
      <div>
        <p
          style={{ fontFamily: "var(--font-family-display)", fontSize: "4rem", fontWeight: 300 }}
          className="text-primary/30 leading-none mb-4"
        >
          404
        </p>
        <p className="text-sm text-muted-foreground">Page not found</p>
      </div>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "papers", Component: Papers },
      { path: "papers/:paperId", Component: PaperDetail },
      { path: "tutor", Component: Tutor },
      { path: "tutor/:paperId", Component: Tutor },
      { path: "patterns", Component: Patterns },
      { path: "generate", Component: Generate },
      { path: "*", Component: NotFound },
    ],
  },
]);
