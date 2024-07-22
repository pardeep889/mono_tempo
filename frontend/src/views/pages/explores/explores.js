import React, { useEffect, useState } from 'react';
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
  CButton
} from '@coreui/react';
import { fetchExplores, promoteExploreAPI } from '../../../api/dashboard';
import Pagination from '../../base/paginations/Paginations';
import LoadingAnimation from '../../base/loader/loader';
import { truncateDescriptionHelper } from '../../../config';

const ExploreTable = () => {
  const [explores, setExplores] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [promoting, setPromoting] = useState(false); // State for promoting indicator

  useEffect(() => {
    loadExplores(currentPage);
  }, [currentPage]);

  const loadExplores = async (page) => {
    setLoading(true); // Set loading to true when starting API request
    try {
      const data = await fetchExplores(page, 10);
      if (data.success) {
        setExplores(data.data);
        setTotalPages(Math.ceil(data.total / 10));
      }
    } catch (error) {
      console.error('Error fetching explores:', error);
    } finally {
      setLoading(false); // Set loading to false when API request completes (whether successful or not)
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const promoteExplore = async (explore) => {
    console.log(explore)
    setPromoting(true); // Set promoting to true when starting promote request
    try {
      const response = await promoteExploreAPI(explore.exploreid, !explore.promoted);
      if (response.success) {
        loadExplores(currentPage); // Reload explores after promotion
      }
    } catch (error) {
      console.error(`Error promoting explore with ID: ${explore.id}`, error);
    } finally {
      setPromoting(false); // Set promoting to false when promote request completes (whether successful or not)
    }
  };

  if (loading) {
    return <LoadingAnimation />;
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
                  <CTableHeaderCell scope="col" style={{ width: '30%', wordWrap: 'break-word' }}>Description</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Creator</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Role</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Promoted</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {explores.map((explore, index) => (
                  <CTableRow key={index}>
                    <CTableHeaderCell scope="row">{(currentPage - 1) * 10 + index + 1}</CTableHeaderCell>
                    <CTableDataCell>{explore.title}</CTableDataCell>
                    <CTableDataCell style={{ wordWrap: 'break-word' }}>{truncateDescriptionHelper(explore.description)}</CTableDataCell>
                    <CTableDataCell>{explore.categoryID}</CTableDataCell>
                    <CTableDataCell>{explore.status}</CTableDataCell>
                    <CTableDataCell>{explore.fullName}</CTableDataCell>
                    <CTableDataCell>{explore.email}</CTableDataCell>
                    <CTableDataCell>{explore.role}</CTableDataCell>
                    <CTableDataCell>{explore.promoted ? 'Yes' : 'No'}</CTableDataCell>
                    <CTableDataCell>
                      <CButton
                        color="primary"
                        onClick={() => promoteExplore(explore)}
                        disabled={promoting}
                      >
                        {promoting ? 'Promoting...' : 'Promote'}
                      </CButton>
                    </CTableDataCell>
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
  );
};

export default ExploreTable;
