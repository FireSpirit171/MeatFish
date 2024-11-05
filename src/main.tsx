import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom' 
import './index.sass'

import MainPage from '../src/app/MainPage/MainPage';
import Layout from './components/Layout/Layout';

const router = createBrowserRouter([
  {
    path: '/',
    element:( 
    <Layout>
      <MainPage />
    </Layout>)
  },
  {
    path: '/dishes',
    element: <h1>Страница блюда</h1>
  },
  {
    path: '/dinners',
    element: <h1>Страница заказа</h1>
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>,
)
