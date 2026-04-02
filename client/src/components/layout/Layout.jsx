import Navbar from './Navbar';
import Footer from './Footer';
import ProfileCompletionAlert from '../profile/ProfileCompletionAlert';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      <ProfileCompletionAlert />
    </div>
  );
};

export default Layout;