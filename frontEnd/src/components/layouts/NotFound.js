import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSkullCrossbones } from "@fortawesome/free-solid-svg-icons";
import Search from "../layouts/Search";
function NotFound() {
  return (
    <div className="container text-center p-5">
        <div className="display-1">
          <FontAwesomeIcon icon={faSkullCrossbones} className="i-va text-warning" />
          404
        </div>
        <h1 className="mb-3">Oops... Page Not Found!</h1>
        <div className="row justify-content-md-center">
          <div className="col-md-6">
            <Search />
          </div>
        </div>
      </div>
  )
}

export default NotFound
