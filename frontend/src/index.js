import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit'
import 'core-js'

import App from './App'
import store from './store'

const authStore = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'http:',
})


createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider store={authStore}>
      <App />
    </AuthProvider>
  </Provider>,
)
