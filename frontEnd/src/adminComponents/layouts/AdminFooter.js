import React from 'react'

function AdminFooter() {
  return (
    <footer className="main-footer my-4">
    <strong>Copyright &copy; 2014-{new Date().getFullYear()} <a href="/" target={'_blank'}>MERN ONLINE STORE</a> </strong>
    All rights reserved.
    <div className="float-right d-none d-sm-inline-block">
      <b>Version</b> 1.0.0
    </div>
    </footer> 
  )
}

export default AdminFooter
