import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import useSignIn from 'react-auth-kit/hooks/useSignIn'
import { useNavigate } from 'react-router-dom'
import { loginApi } from '../../../api/auth'

const Login = () => {
  const [loading, setLoading] = useState(false);
  const signIn = useSignIn()
  const navigate = useNavigate()
  

  const loginHandler = async (event) => {
    event.preventDefault();
    setLoading(true)
    const formData = new FormData(event.target);
    const username = formData.get('username');
    const password = formData.get('password');

    try {
    const resp = await loginApi({
      email: username,
      password: password,
    });
    const user = resp.data.user;
    if (
      signIn({
        auth: {
          token: `${resp.data.token}`,
        },
        userState: { token: `${resp.data.token}`, ...user },
      })
    ) {
      navigate('/dashboard')
    } else {
      console.log("Not Authenitcated")
    }
      
    } catch (error) {
      setLoading(false);
    }
    // console.log(response)
    // console.log('Username:', username);
    // console.log('Password:', password);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={loginHandler}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput name="username" placeholder="Username" autoComplete="username" />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        name="password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type='submit' color="primary" className="px-4">
                            {loading ? <CSpinner size="sm" /> : 'Login'}
                        </CButton>
                      </CCol>
                      {/* <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol> */}
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Admin Login</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      {/* <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton> */}
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
