import Navbar from './NavbarMenu'
// for conditional rendering navbar
import ApprovelHead from './Header';
function Layout({children,hideNavbar}){


    return(
        <>
        {hideNavbar ? <ApprovelHead/> : <Navbar/>}
        {children}

        </>
    )
}


export default Layout;
