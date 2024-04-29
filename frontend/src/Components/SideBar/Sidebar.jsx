import React from 'react'
import { NavLink, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Authenticate from '../../Store/Authenticate'
import Toaster from '../../Utils/Constants/Toaster'
import LocalStore from '../../Store/LocalStore'
import logo from "../../../public/assets/images/logos/dark-logo.svg"

export default function Sidebar() {
    const location = useLocation()
    const userHome = location.pathname === '/main/user'
    const adminHome = location.pathname === '/main/admin'
    

    

    const navigate = useNavigate()

    const isAdmin = () => {
        const tokenData = LocalStore.getToken();
        return tokenData && tokenData.role === 'admin';
    };
    if(userHome) return <Navigate to={'/main/user/products'} />
    if (adminHome) return <Navigate to={'/main/user/employee'} />
    
    
    
    return (
        <aside className="left-sidebar shadow-sm">
            {/* Sidebar scroll*/}
            <div>
                <div className="brand-logo d-flex align-items-center justify-content-between">
                    <NavLink to={'/main'} className="text-nowrap logo-img">
                        <img src={logo} alt='logo' width={180} />
                    </NavLink>
                    <div className="close-btn d-xl-none d-block sidebartoggler cursor-pointer" id="sidebarCollapse">
                        <i className="ti ti-x fs-8" />
                    </div>
                </div>
                {/* Sidebar navigation*/}
                <nav className="sidebar-nav scroll-sidebar" data-simplebar>
                    <ul id="sidebarnav" className="h-100 my-0 overflow-hidden">
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4" />
                            <span className="hide-menu">Home</span>
                        </li>
                        {
                            isAdmin() ? (
                                <>
                                    <li className="sidebar-item">
                                        <NavLink to={'/main/admin/employee'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-user" />
                                            </span>
                                            <span className="hide-menu">Employee Management</span>
                                        </NavLink>
                                    </li>
                                    <li className="sidebar-item">
                                        <NavLink to={'/main/admin/delivery'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-building-warehouse" />
                                            </span>
                                            <span className="hide-menu">Delievery Management</span>
                                        </NavLink>
                                    </li>

                                    <li className="sidebar-item">
                                        <NavLink to={'/stocks'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-building-warehouse" />
                                            </span>
                                            <span className="hide-menu">Stock Management</span>
                                        </NavLink>
                                    </li>

                                    

                                    <li className="sidebar-item">
                                        <NavLink to={'/pay'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-building-warehouse" />
                                            </span>
                                            <span className="hide-menu">Payment Management</span>
                                        </NavLink>
                                    </li>


                                    <li className="sidebar-item">
                                        <NavLink to={'/flist'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-building-warehouse" />
                                            </span>
                                            <span className="hide-menu">Cus.affair Management</span>
                                        </NavLink>
                                    </li>


                                    <li className="sidebar-item">
                                        <NavLink to={'/list'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-building-warehouse" />
                                            </span>
                                            <span className="hide-menu"></span>
                                        </NavLink>
                                    </li>



                                </>
                            ) : (
                                <>
                                    <li className="sidebar-item">
                                        <NavLink to={'/main/user/products'} className="sidebar-link" aria-expanded="false" end={true}>
                                            <span>
                                                <i className="ti ti-layout-dashboard" />
                                            </span>
                                            <span className="hide-menu">Products</span>
                                        </NavLink>
                                    </li>
                                    <li className="sidebar-item">
                                        <NavLink to={'/main/user/notification'} className="sidebar-link" aria-expanded="false">
                                            <span>
                                                <i className="ti ti-bell" />
                                            </span>
                                            <span className="hide-menu">Notifications</span>
                                        </NavLink>
    
                                    </li>

                                   










                                </>
                            )
                        }
                        <li className="nav-small-cap">
                            <i className="ti ti-dots nav-small-cap-icon fs-4" />
                            <span className="hide-menu">AUTH</span>
                        </li>
                        <li className="sidebar-item">
                            <button type='button' onClick={() => {
                                Toaster.justToast('info', "   Logging You Out ......", () => {
                                    Authenticate.logoutUser();
                                    navigate('/login')
                                })
                            }} className="sidebar-link bg-transparent border-0" aria-expanded="false">
                                <span>
                                    <i className="ti ti-login" />
                                </span>
                                <span className="hide-menu">Logout</span>
                            </button>
                        </li>
                    </ul>
                </nav>
                {/* End Sidebar navigation */}
            </div>
        </aside>

    )
}
