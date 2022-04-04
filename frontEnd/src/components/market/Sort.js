import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortProducts } from '../../ReduxCycle/actions/productsActions';

function Sort() {
  const [sortName, setSortName] = useState(true);
  const [sortPrice, setSortPrice] = useState(true);
  const [sortAdded, setSortAdded] = useState(true);
  const [isMountedName, setIsMountedName] = useState(false);
  const [isMountedPrice, setIsMountedPrice] = useState(false);
  const [isMountedAdded, setIsMountedAdded] = useState(false);

  

  let dispatch = useDispatch()
  let SortProducts = bindActionCreators(sortProducts,dispatch);


  const handleSort=(type)=>{
    switch (type) {
      case "name": setSortName(!sortName)
        break;

      case "price": setSortPrice(!sortPrice)
        break;

      case "added": setSortAdded(!sortAdded)
        break;
        
      default: setSortName(1) 
    }

  }

  useEffect(()=>{
    if (isMountedName) {
      SortProducts('name', sortName)
    }else(setIsMountedName(true))
    // eslint-disable-next-line
  }, [sortName])

  useEffect(()=>{
    if (isMountedPrice) {
    SortProducts('price', sortPrice)
  }else(setIsMountedPrice(true))
  // eslint-disable-next-line
  }, [sortPrice])

  useEffect(()=>{
    if (isMountedAdded) {
    SortProducts('createdAt', sortAdded)
  }else(setIsMountedAdded(true))
  // eslint-disable-next-line
  }, [sortAdded])


  return (
    <div className="dropdown-menu " aria-labelledby="triggerSortId">
      <strong onClick={()=>handleSort('mostPopular')} style={{cursor:'pointer'}} className="dropdown-item"><i className='far fa-star text-warning'></i> Most Popular</strong>
      <div className="dropdown-divider m-0"></div>
      <strong onClick={()=>handleSort('name')} style={{cursor:'pointer'}} className="dropdown-item" >
        {!sortName?<i className='fas fa-sort-alpha-up text-info'> Products Asc</i>:<i className='fas fa-sort-alpha-down text-info'> Products Dec</i>}
      </strong>
      <div className="dropdown-divider m-0"></div>
      <strong onClick={()=>handleSort('added')} style={{cursor:'pointer'}} className="dropdown-item">
        {!sortAdded?<i className='fas fa-sort-amount-up text-danger'> Added (Latest)</i>:<i className='fas fa-sort-amount-down text-danger'> Added (Newest)</i>}
      </strong>
      <div className="dropdown-divider m-0"></div>
      <strong onClick={()=>handleSort("price")} style={{cursor:'pointer'}} className="dropdown-item" >
        {!sortPrice?<i className='fas fa-sort-numeric-down text-primary'> Price (from low to high)</i>:<i className='fas fa-sort-numeric-up text-primary'> Price (from high to low)</i>}
      </strong>
    </div>
    )
}

export default Sort;
