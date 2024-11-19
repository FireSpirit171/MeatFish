import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './store/store'
import './index.sass'

import DishPage from './pages/DishPage/DishPage';
import MainPage from './pages/MenuPage/MainPage';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';

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
    path: '/',
    element: (
      <Layout>
        <HomePage />
      </Layout>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <Provider store={store}> 
    <RouterProvider router={router}></RouterProvider>
  </Provider>
)

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
      navigator.serviceWorker
          .register("/MeatFish/sw.js")
          .then(() => console.log("service worker registered"))
          .catch((err) => console.log("service worker not registered", err));
  });
}