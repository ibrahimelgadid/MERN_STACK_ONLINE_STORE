import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { getProductsByFilter } from "../../ReduxCycle/actions/productsActions";
import RangeSlider from "./RangeSlider";


function ModalSearch({ brands, categories }) {

  let [category, setCategory] = useState([]);
  let [brand, setBrand] = useState([]);
  let [price, setPriceValue] = useState([0,400]);


  let handleToggleCategoryChecked = (categoryName)=>{
    const currentIndex = category.indexOf(categoryName);
    const newCategory = [...category]
    if (currentIndex === -1) {
      newCategory.push(categoryName)
    }else{
      newCategory.splice(currentIndex, 1)
    }
    setCategory(newCategory)
  }


  let handleToggleBrandChecked = (brandName)=>{
    const currentIndex = brand.indexOf(brandName);
    const newBrand = [...brand]
    if (currentIndex === -1) {
      newBrand.push(brandName)
    }else{
      newBrand.splice(currentIndex, 1)
    }
    setBrand(newBrand)
  }


  const dispatch = useDispatch();

  let GetProductsByFilter = bindActionCreators(getProductsByFilter, dispatch)

  let handleSubmit = (e)=>{
    e.preventDefault();
    let searchData = {
      category,brand,price
    }
    GetProductsByFilter(searchData)
  }

  return (
    <div
      className="modal fade"
      id="modelId"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modelTitleId"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Filter</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit} >
              <div className="row">
                <div className="col-sm-4">
                  <h5>Category</h5>
                  {categories.length > 0 &&
                    categories.map((cat) => (
                      <div key={cat._id}  className="form-check">
                        <input key={cat._id}
                          type="checkbox"
                          className="form-check-input"
                          id={cat.name}
                          value={cat.name}
                          // category
                          onChange={(e)=>handleToggleCategoryChecked(cat.name)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={cat.name}
                        >
                          {cat.name}
                        </label>
                      </div>
                    ))}
                </div>

                <div className="col-sm-4">
                  <h5>Brand</h5>
                  {brands.length > 0 &&
                    brands.map((bra) => (
                      <div key={bra._id} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={bra.name}
                          value={bra.name}
                          // brand
                          onChange={(e)=>handleToggleBrandChecked(bra.name)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={bra.name}
                        >
                          {bra.name}
                        </label>
                      </div>
                    ))}
                </div>

                <div className="col-sm-4">
                  <h5 className="bold">Price</h5>                  
                  <RangeSlider 
                    price={price}
                    setPriceValue={setPriceValue}
                  />
                  <strong className="float-start mt-2">${price[0]}</strong>
                  <strong className="float-end mt-2">${price[1]}</strong>
                  
                </div>
              </div>
              <div className="modal-footer">
                <div className="btn-group" role="group" aria-label="">
                  <button data-bs-dismiss="modal" type="button" className="btn btn-sm btn-danger"><i className="fas fa-times-circle"></i> </button>
                  <button data-bs-dismiss="modal" type="submit" className="btn btn-sm btn-outline-primary"><i className="fas fa-filter"></i> filter</button>
                </div>

              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalSearch;
