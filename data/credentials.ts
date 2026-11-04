type User = {
    email: string;
    password: string;
    name: string;
    role: string;
    other: string;
}

const users: User[] = [
    {
        email: "admin@company.com",
        password: "password",
        name: "Admin",
        role: "admin",
        other: "..."
    },
    {
        email: "user@company.com",
        password: "password",
        name: "User",
        role: "user",
        other: "..."
    }
];

export type Credentials = {
    token: string;
    email: string;
    name: string;
    role: string;
}

export const login = (email: string, password: string): Promise<Credentials | string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(Math.random() <= 0.8) {
                const uResult = users.find((user) => user.email === email && user.password === password);
                if(uResult) {
                    resolve({
                        token: crypto.randomUUID(),
                        email: email,
                        name: uResult.name,
                        role: uResult.role
                    } as Credentials);
                } else reject('user not found');
            } else reject('connection refused');
        }, 1000 + Math.random() * 2000);
    });
};

export const logout = (token: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(Math.random() <= 0.8) {
                resolve('success');
            } else reject('connection refused');
        }, 1000 + Math.random() * 2000);
    });
}