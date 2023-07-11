import React from 'react';

const ReactMiddleware = ({ children }) => (
    <React.StrictMode>
        {children}
    </React.StrictMode>
);

export default ReactMiddleware;