import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner // Import CSpinner for loading indicator
} from '@coreui/react'
import { fetchUsers } from '../../../api/dashboard'
import Pagination from '../../base/paginations/Paginations'
import LoadingAnimation from '../../base/loader/loader'

const Tables = () => {
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false) // State for loading indicator

  useEffect(() => {
    loadUsers(currentPage)
  }, [currentPage])

  const loadUsers = async (page) => {
    setLoading(true); // Set loading to true when starting API request
    try {
      const data = await fetchUsers((page - 1) * 2, 10, 'ADMIN')
      if (data.success) {
        setUsers(data.data)
        setTotalPages(Math.ceil(data.total / 2))
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false); // Set loading to false when API request completes (whether successful or not)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if(loading){
    return  <LoadingAnimation/>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Admins Table</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Full Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Account Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Location</CTableHeaderCell>
                  {/* <CTableHeaderCell scope="col">First Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Last Name</CTableHeaderCell> */}
                  {/* <CTableHeaderCell scope="col">Profile Image URL</CTableHeaderCell> */}
                  <CTableHeaderCell scope="col">Stripe Customer ID</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
              {users.map((user, index) => (
                  <CTableRow key={user.id}>
                    <CTableHeaderCell scope="row">{(currentPage - 1) * 10 + index + 1}</CTableHeaderCell>
                    <CTableDataCell>{user.fullName}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.username}</CTableDataCell>
                    <CTableDataCell>{user.accountStatus}</CTableDataCell>
                    <CTableDataCell>{user.role}</CTableDataCell>
                    <CTableDataCell>{user.location}</CTableDataCell>
                    {/* <CTableDataCell>{user.firstName}</CTableDataCell>
                    <CTableDataCell>{user.lastName}</CTableDataCell> */}
                    {/* <CTableDataCell>{user.profileImageUrl}</CTableDataCell> */}
                    <CTableDataCell>{user.stripeCustomerId}</CTableDataCell>
                    {/* Render more data cells for other fields */}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Tables
