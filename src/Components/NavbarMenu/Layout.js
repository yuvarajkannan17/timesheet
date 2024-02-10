import Navbar from './NavbarMenu'
// for conditional rendering navbar
function Layout({children,hideNavbar}){


    return(
        <>
        {!hideNavbar&& <Navbar/>}
        {children}
        </>
    )
}


export default Layout;
