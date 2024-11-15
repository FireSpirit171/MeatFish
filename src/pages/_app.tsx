import React from 'react';
import '../styles/globals.sass';
import Header from '@/components/Header';

function App({ Component, pageProps }) {
    return (
        <>
            <Header></Header>
            <Component {...pageProps} />
        </>
    );
}

export default App;
