export const checkAdminAccess = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    console.log('No user found in localStorage');
    return false;
  }
  
  try {
    const user = JSON.parse(userStr);
    console.log('Current user:', user);
    console.log('User role:', user.role);
    console.log('Is admin?', user.role === 'admin');
    
    if (user.role === 'admin') {
      console.log('✅ Admin access granted');
      return true;
    } else {
      console.log('❌ Admin access denied - role is:', user.role);
      return false;
    }
  } catch (error) {
    console.error('Error parsing user:', error);
    return false;
  }
};