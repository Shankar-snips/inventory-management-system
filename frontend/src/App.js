import { Navigate, Route, Routes } from 'react-router-dom';
// public routes path
import ProjectIntro from './pages/ProjectIntro/ProjectIntro';
import Login from './component/Login/Login';
import Signup from './component/Signup/Signup';

// protected routes path
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import ChangePassword from './component/Change Password/ChangePassword';
import EditProfile from './component/EditProfile/EditProfile';
import ConsumableStockBook from './pages/ConsumableStockBook/ConsumableStockBook';
import Department from './pages/Department/Department';
import IndentBook from './pages/IndentBook/IndentBook';
import Items from './pages/Item/Item';
import StockBookToolsAndPlants from './pages/StockBookToolsAndPlants/StockBookToolsAndPlants';
import SupplierItem from './pages/SupplierItems/SupplierItems';
import Supplier from './pages/Supplier/Supplier';

// browsing type handler
import Public from './BrowsingMode/Public';
import Private from './BrowsingMode/Private';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
          
      <Public />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<ProjectIntro />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<Signup />} />

        {/* Protected Routes */}
        <Route element={<Private />}>
          <Route path="/home" element={<Home />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/changepassword' element={<ChangePassword />} />
          <Route path='/editprofile' element={<EditProfile />} />
          <Route path='/csb' element={<ConsumableStockBook />} />
          <Route path='/department' element={<Department />} />
          <Route path='/indentBook' element={<IndentBook />} />
          <Route path='/items' element={<Items />} />
          <Route path='/sbtp' element={<StockBookToolsAndPlants />} />
          <Route path='/supplier' element={<Supplier />} />
          <Route path='/supplieritems' element={<SupplierItem />} />
        </Route>

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
