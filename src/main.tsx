// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.sass'

import DishPage from './app/DishPage/DishPage';
import MainPage from '../src/app/MainPage/MainPage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/dishes/',
    element: (
      <Layout>
        <MainPage />
      </Layout>
    ),
  },
  {
    path: '/dishes/:id',
    element: (
      <Layout>
        <DishPage />
      </Layout>
    ),
  },
  {
    path: '/dinners',
    element: <h1>Страница заказа</h1>,
  },
]);


createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router}></RouterProvider>
)
