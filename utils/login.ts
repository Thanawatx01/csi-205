import { logout } from "@/data/credentials";
import { useRouter } from "next/navigation";

type Router = ReturnType<typeof useRouter>;

export function isLogin(router: Router, returnPath: string) {
    const credentials = localStorage.getItem('credentials');
    if(credentials !== null) {
        const { token, email, name, role } = JSON.parse(credentials);
        if(token === undefined || email === undefined || name === undefined || role === undefined) {
            localStorage.setItem('returnPath', returnPath);
            router.push('/login');
        }else {
            router.push(returnPath);
        }
    }else {
        localStorage.setItem('returnPath', returnPath);
            router.push('/login');
    }
}

export const doLogout = (router: Router, returnPath: string) => {

    const credentials = localStorage.getItem('credentials');
    if(credentials !== null) {
        const { token } = JSON.parse(credentials);
        if(token !== undefined) {
            logout(token)
                .then(() => {
                    localStorage.removeItem('credentials');
                    router.push(returnPath);
                })
                .catch(() => {
                    alert('Failed to logout');
                });
        }else {
            router.push(returnPath);
        }
    }else {
        router.push(returnPath);
    }
}