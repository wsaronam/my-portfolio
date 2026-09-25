import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";




export const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
    }
])