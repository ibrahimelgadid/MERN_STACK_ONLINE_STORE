import React from 'react';
import { Link } from 'react-router-dom';
import isEmpty from '../../utilis/isEmpty';

function Categories({categories}) {
  return(
    <div className="accordion" id="accordionExample">
      <div className="accordion-item">
        <h2 className="accordion-header" id="headingOne">
          <button className="accordion-button bg-secondary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
            Category
          </button>
        </h2>
        <div id="collapseOne" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
          <div className="accordion-body p-0">
          <ul className="list-group">
            {isEmpty(categories)?'':(
              categories.map(cat=>(
              <li className="list-group-item" key={cat._id}>
                <Link style={{textDecoration:'none'}} to={`/category/${cat.name}`}>
                  {cat.name}
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

export default Categories;
