import React, { useContext, useState, useEffect } from "react";
import AuthHeader from './AuthHeader';

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signUp(username, email, password) {
    const response = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        email,
        password,
      })
    })
    const resData = await response.json()
    return resData
  }

  async function logIn(email, password) {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    const resData = await response.json()
    if (resData && resData.token) {
      localStorage.setItem('userInfo', JSON.stringify(resData))
      setCurrentUser(resData)
    }
    return resData
  }

  function logOut() {
    localStorage.removeItem('userInfo')
    setCurrentUser()
  }

  function updateUserPassword(password) {
    return fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...AuthHeader() },
      body: JSON.stringify({
        email: currentUser.email,
        password,
      })
    })
  }

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo')
    if (userInfo) setCurrentUser(JSON.parse(userInfo))
    setLoading(false)
  }, [])

  const value = {
    currentUser,
    signUp,
    logIn,
    logOut,
    updateUserPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
