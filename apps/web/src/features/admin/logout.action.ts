import { logout } from '../auth/auth.api';
import { redirect } from 'react-router';




export async function logoutAction() {
    await logout();
    return redirect('/admin/login');
}