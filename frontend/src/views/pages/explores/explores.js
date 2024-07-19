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
} from '@coreui/react'
import { fetchExplores } from '../../../api/dashboard'
import Pagination from '../../base/paginations/Paginations'
import LoadingAnimation from '../../base/loader/loader'

const ExploreTable = () => {
  const [explores, setExplores] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false) // State for loading indicator

  useEffect(() => {
    loadExplores(currentPage)
  }, [currentPage])

  const loadExplores = async (page) => {
    setLoading(true) // Set loading to true when starting API request
    try {
      const data = await fetchExplores(page, 10)
      if (data.success) {
        setExplores(data.data)
        setTotalPages(Math.ceil(data.total / 10))
      }
    } catch (error) {
      console.error('Error fetching explores:', error)
    } finally {
      setLoading(false) // Set loading to false when API request completes (whether successful or not)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  if (loading) {
    return <LoadingAnimation />
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Explore Table</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Creator</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {explores.map((explore, index) => (
                  <CTableRow key={explore.id}>
                    <CTableHeaderCell scope="row">{(currentPage - 1) * 10 + index + 1}</CTableHeaderCell>
                    <CTableDataCell>{explore.title}</CTableDataCell>
                    <CTableDataCell>{explore.description}</CTableDataCell>
                    <CTableDataCell>{explore.categoryID}</CTableDataCell>
                    <CTableDataCell>{explore.status}</CTableDataCell>
                    <CTableDataCell>{explore.fullName}</CTableDataCell>
                    <CTableDataCell>{explore.email}</CTableDataCell>
                    <CTableDataCell>{explore.role}</CTableDataCell>
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

export default ExploreTable
