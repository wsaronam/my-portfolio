import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { BlogPage } from "./features/blog/BlogPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./features/projects/ProjectDetailPage";




export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'projects', element: <ProjectsPage /> },
            { path: 'projects/:slug', element: <ProjectDetailPage /> },
            { path: 'blog', element: <BlogPage /> },
            { path: '*', element: <NotFoundPage /> }
        ]
    }
])