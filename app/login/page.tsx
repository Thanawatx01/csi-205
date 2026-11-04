"use client";

import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/tailgrids/core/dialog";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupButton,
    InputGroupInput
  } from "@/components/tailgrids/core/input-group";
import { EyeDisabled, Keyboard } from "@tailgrids/icons";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { login } from "@/data/credentials";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const handleLogin = () => {
        const email = document.getElementById("email") as HTMLInputElement;
        const password = document.getElementById("password") as HTMLInputElement;
        
        if(email.value === '') {
            email.focus();
            alert('Please enter your email');
            return;
        }
        if(password.value === '') {
            password.focus();
            alert('Please enter your password');
            return;
        }

        login(`${email.value}@company.com`, password.value)
            .then((result) => {
                localStorage.setItem('credentials', JSON.stringify(result));
                const returnPath = localStorage.getItem('returnPath');
                if(returnPath) {
                    router.push(returnPath);
                } else {
                    router.push('/');
                }
            })
            .catch((error) => {
                email.value = '';
                password.value = '';
                email.focus();
                alert(`Error: ${error}`);
            })
            .finally(() => {
            })
    }

    return (
        <>
            <Backdrop isOpen={true}>
                <Dialog showCloseButton={true} className="w-lg">
                    <DialogHeader>
                        <DialogTitle>Login</DialogTitle>
                    </DialogHeader>
                    <DialogBody className="flex flex-col gap-4">
                        <InputGroup>
                            <InputGroupAddon>
                                <Keyboard />
                            </InputGroupAddon>
                            <InputGroupInput type="email" id="email" placeholder="Email" />
                            <InputGroupAddon align={'inline-end'}>
                                @company.com
                            </InputGroupAddon>
                        </InputGroup>

                        <InputGroup>
                            <InputGroupAddon>
                                <EyeDisabled />
                            </InputGroupAddon>
                            <InputGroupInput type="password" id="password" placeholder="Password" />
                        </InputGroup>
                    </DialogBody>

                    <DialogFooter>
                        <DialogClose appearance={'outline'} onClick={() => handleLogin()}>
                            Login
                        </DialogClose>
                    </DialogFooter>
                </Dialog>
            </Backdrop>
        </>
    );
}