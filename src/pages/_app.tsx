import React, { useEffect } from 'react';
import '../styles/globals.sass';
import Header from '@/components/Header';
import { Provider } from 'react-redux';
import store from '../store/store';
import { AppProps } from 'next/app';
import ApiClient from '@/api/APIClient';

const App = ({ Component, pageProps }: AppProps & { csrfToken: string }) => {
    useEffect(() => {
        // Устанавливаем CSRF токен в cookies
        if (!document.cookie.includes('csrftoken')) {
            document.cookie = `csrftoken=${pageProps.csrfToken}; path=/;`;
        }
    }, [pageProps.csrfToken]);

    return (
        <Provider store={store}>
            <Header />
            <Component {...pageProps} />
        </Provider>
    );
};

App.getInitialProps = async () => {
    const csrfToken = await ApiClient.getCsrfToken();
    return {
        pageProps: {
            csrfToken,
        },
    };
};

export default App;
