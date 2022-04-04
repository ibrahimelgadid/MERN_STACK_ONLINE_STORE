import React from 'react';

function Contact({phone,setPhone}) {
  return (
    <div className="card mb-3">
      <div className="card-header">
      <i className="fa-bags-shopping"></i>
        <i className="fas fa-envelope"></i> Contact Info
      </div>
      <div className="card-body">
        <div className="row g-3">
          <div className="col-md-6">
            <input
              type="tel"
              className="form-control"
              placeholder="Mobile no"
              aria-label="Mobile no"
              value={phone}
              onChange={(e)=>setPhone(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact;
