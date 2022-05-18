import React from 'react';

import Home from '../../pages/Home';
import Profil from '../../pages/Profil';
import Trending from '../../pages/Trending';
import Navbar from '../Navbar';

import {
  
  Routes,
  Route,
} from "react-router-dom";

const index = () => {
  return (
    <div>
      <Navbar />
   
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/trending" element={<Trending />} />
      </Routes>
      
    </div>
  );
};

export default index;