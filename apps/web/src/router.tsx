import { createBrowserRouter, redirect } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { HomePage } from "./pages/HomePage";
import { ProjectsPage } from "./features/projects/ProjectsPage";
import { BlogPage } from "./features/blog/BlogPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProjectDetailPage } from "./features/projects/ProjectDetailPage";
import { PageLoader } from './components/ui/PageLoader';
import { blogLoader } from './features/blog/blog.loader';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { BlogPostPage } from './features/blog/BlogPostPage';
import { postLoader } from './features/blog/post.loader';
import { LoginPage } from './features/auth/LoginPage';
import { loginLoader, loginAction } from './features/auth/login.route';
import { AdminLayout } from './features/admin/AdminLayout';
import { adminLayoutLoader } from './features/admin/adminLayout.loader';
import { AdminPostsPage } from './features/admin/AdminPostsPage';
import { adminPostsLoader, adminPostsAction } from './features/admin/adminPosts.route';
import { logoutAction } from './features/admin/logout.action';
import { postEditorAction, postEditorLoader } from './features/admin/PostEditor.route';
import { PostEditorPage } from './features/admin/PostEditorPage';




export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        hydrateFallbackElement: <PageLoader />,
        children: [
            { index: true, element: <HomePage /> },
            { path: 'projects', element: <ProjectsPage /> },
            { path: 'projects/:slug', element: <ProjectDetailPage /> },
            { path: 'blog', element: <BlogPage />, loader: blogLoader, errorElement: <RouteErrorPage /> },
            { path: '*', element: <NotFoundPage /> },
            { path: 'blog/:slug', element: <BlogPostPage />, loader: postLoader, errorElement: <RouteErrorPage /> }
        ]
    },

    {
        path: '/admin/login',
        element: <LoginPage />,
        loader: loginLoader,
        action: loginAction,
        hydrateFallbackElement: <PageLoader />,
    },

    {
        path: '/admin',
        element: <AdminLayout />,
        loader: adminLayoutLoader,
        hydrateFallbackElement: <PageLoader />,
        errorElement: <RouteErrorPage />,
        children: [
            { index: true, loader: () => redirect('/admin/posts') },
            {
                path: 'posts',
                element: <AdminPostsPage />,
                loader: adminPostsLoader,
                action: adminPostsAction,
                errorElement: <RouteErrorPage />,
            },
            { path: 'logout', action: logoutAction },
            {
                path: 'posts/new',
                element: <PostEditorPage />,
                loader: postEditorLoader,
                action: postEditorAction,
                errorElement: <RouteErrorPage />,
            },
            {
                path: 'posts/:id/edit',
                element: <PostEditorPage />,
                loader: postEditorLoader,
                action: postEditorAction,
                errorElement: <RouteErrorPage />,
            },
        ]
    }
])