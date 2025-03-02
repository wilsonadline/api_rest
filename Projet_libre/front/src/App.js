import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import AuthProvider from "./hooks/AuthProvider";
import {PrivateRoute, AdminRoute} from "./router/route";
import Register from "./components/Register";
import DetailsUser from "./components/DetailsUser";
import Profile from "./components/Profile";
import UserManage from "./components/Admin/UserManage";
import UpdateUser from "./components/Admin/UpdateUser";
import AddressManage from "./components/Admin/AddressManage";
import DashboardAdmin from "./components/Admin/DashboardAdmin";
import UpdateAddress from "./components/Admin/UpdateAddress";
import AddAddress from "./components/AddAddress";
import UpdateAddresseUser from "./components/UpdateAddresseUser";
import Home from "./components/PROJET_LIBRE_FRONT/Home";
import FicheGame from "./components/PROJET_LIBRE_FRONT/FicheGame";
import Cart from "./components/PROJET_LIBRE_FRONT/Cart";
import Checkout from "./components/PROJET_LIBRE_FRONT/Checkout";
import ConfirmOrder from "./components/PROJET_LIBRE_FRONT/ConfirmOrder";
import Categorie from "./components/PROJET_LIBRE_FRONT/Categorie";
import Orders from "./components/PROJET_LIBRE_FRONT/Orders";
import AllProducts from "./components/PROJET_LIBRE_FRONT/AllProducts";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="*" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/game/:id" element={<FicheGame />} />
            <Route path="/cart" element={<Cart />} />

            {/* Categories */}
            <Route path="/categorie/:categorie" element={<Categorie />} />

            <Route element={<PrivateRoute />}>
              <Route path="/orders" element={<Orders />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/confirmorder" element={<ConfirmOrder />} />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/user/:id" element={<DetailsUser />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/address/add" element={<AddAddress />} />
              <Route path="/all-products/" element={<AllProducts />} />
              <Route path="/address/update/:id" element={<UpdateAddresseUser />} />
            </Route>
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<DashboardAdmin />} />
              <Route path="/admin/users" element={<UserManage />} />
              <Route path="/admin/user/update/:id" element={<UpdateUser />} />
              <Route path="/admin/address" element={<AddressManage />} />
              <Route path="/admin/address/update/:id" element={<UpdateAddress />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;