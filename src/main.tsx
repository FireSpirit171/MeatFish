import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import './index.sass';

import DishPage from './pages/DishPage/DishPage';
import MainPage from './pages/MenuPage/MainPage';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage/HomePage';
import { useEffect } from 'react';

import { invoke } from "@tauri-apps/api";

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

function App() {
  useEffect(() => {
    invoke('create')
      .then((response: string) => console.log(response))
      .catch((error: any) => console.error('Error:', error));

    return () => {
      invoke('close')
        .then((response: string) => console.log(response))
        .catch((error: any) => console.error('Error:', error));
    };
  }, []);

  return (
    <Provider store={store}>
      <RouterProvider router={router}></RouterProvider>
    </Provider>
  );
}

createRoot(document.getElementById('root')!).render(<App />);