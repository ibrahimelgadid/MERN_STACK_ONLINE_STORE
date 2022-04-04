import React from 'react';
import { Link } from 'react-router-dom';
import isEmpty from '../../utilis/isEmpty';

function Brands({brands}) {
  return(
    <div className="accordion" id="brandAcc">
      <div className="accordion-item">
        <h2 className="accordion-header" id="brandHeadingOne">
          <button className="accordion-button bg-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#brandCollapseOne" aria-expanded="true" aria-controls="brandCollapseOne">
            Brands
          </button>
        </h2>
        <div id="brandCollapseOne" className="accordion-collapse collapse show" aria-labelledby="brandHeadingOne" data-bs-parent="#brandAcc">
          <div className="accordion-body p-0">
            <ul className="list-group">
              {isEmpty(brands)?'':(
                brands.map(brand=>(
                <li className="list-group-item" key={brand._id}>
                  <Link style={{textDecoration:'none'}} to={`/brand/${brand.name}`}>
                    {brand.name}
                  </Link>
                </li>
                ))
              )}

            </ul>
          </div>
        </div>
      </div>
    </div>
    );
}

export default Brands;
