import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handleClick = (page) => {
    // if (page > 0 && page <= totalPages) {
      onPageChange(page)
    // }
  }

  return (
    <CPagination aria-label="Page navigation example">
      <CPaginationItem style={{cursor: "pointer"}} onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>Previous</CPaginationItem>
      {Array.from({ length: totalPages }, (_, index) => (
        <CPaginationItem
          key={index}
          active={index + 1 === currentPage}
          onClick={() => handleClick(index + 1)}
        >
          {index + 1}
        </CPaginationItem>
      ))}
      <CPaginationItem style={{cursor: "pointer"}} onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>Next</CPaginationItem>
    </CPagination>
  )
}

export default Pagination
