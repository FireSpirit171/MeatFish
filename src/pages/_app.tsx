import React from 'react';
import '../styles/globals.sass';
import Header from '@/components/Header';
import { Provider } from 'react-redux';
import store from '../store/store';
import { AppProps } from 'next/app';

function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <Header></Header>
            <Component {...pageProps} />
        </Provider>
    );
}

export default App;
