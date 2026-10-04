"use client";

import { useState } from "react";
import { authClient, signUp } from "@/lib/auth-client";
import { FloppyDisk, Copy, Eye, EyeSlash, ArrowRotateRight } from "@gravity-ui/icons";
import {
    Button,
    Description,
    FieldError,
    FieldGroup,
    Fieldset,
    Form,
    Input,
    Label,
    TextField,
} from "@heroui/react";

const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "0123456789";
const SPECIAL = "!@#$%^&*";

const generatePassword = (length = 16) => {
    const allCharacters =
        UPPERCASE + LOWERCASE + NUMBERS + SPECIAL;

    const getRandomCharacter = (characters) => {
        const randomArray = new Uint32Array(1);

        crypto.getRandomValues(randomArray);

        return characters[randomArray[0] % characters.length];
    };

    // Guarantee every required character type
    const characters = [
        getRandomCharacter(UPPERCASE),
        getRandomCharacter(LOWERCASE),
        getRandomCharacter(NUMBERS),
        getRandomCharacter(SPECIAL),
    ];

    // Fill the remaining length
    while (characters.length < length) {
        characters.push(getRandomCharacter(allCharacters));
    }

    // Securely shuffle the generated characters
    for (let i = characters.length - 1; i > 0; i--) {
        const randomArray = new Uint32Array(1);

        crypto.getRandomValues(randomArray);

        const j = randomArray[0] % (i + 1);

        [characters[i], characters[j]] = [characters[j], characters[i]];
    }

    return characters.join("");
};

const SignUpPage = () => {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleGeneratePassword = () => {
        const generatedPassword = generatePassword(16);

        setPassword(generatedPassword);
    };

    const handleCopyPassword = async () => {
        if (!password) return;

        await navigator.clipboard.writeText(password);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const data = Object.fromEntries(formData.entries());



        const { data: userData, error } = await signUp.email({
            name: data.name,
            email: data.email,
            password: data.password,
            callbackURL: "/",
        });



        console.log(userData, error);
    };

    return (
        <Form
            className="w-full max-w-96"
            onSubmit={onSubmit}
        >
            <Fieldset>
                <Fieldset.Legend>
                    Create Account
                </Fieldset.Legend>

                <Description>
                    Create your account with your name, email and password.
                </Description>

                <FieldGroup>
                    <TextField
                        isRequired
                        name="name"
                        validate={(value) => {
                            if (value.length < 3) {
                                return "Name must be at least 3 characters";
                            }

                            return null;
                        }}
                    >
                        <Label>Name</Label>
                        <Input placeholder="John Doe" />
                        <FieldError />
                    </TextField>

                    <TextField
                        isRequired
                        name="email"
                        type="email"
                    >
                        <Label>Email</Label>
                        <Input placeholder="john@example.com" />
                        <FieldError />
                    </TextField>

                    <TextField
                        isRequired
                        name="password"
                        // type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={setPassword}
                        validate={(value) => {
                            if (value.length < 8) {
                                return "Password must be at least 8 characters";
                            }

                            if (!/[A-Z]/.test(value)) {
                                return "Password must contain at least one uppercase letter";
                            }

                            if (!/[a-z]/.test(value)) {
                                return "Password must contain at least one lowercase letter";
                            }

                            if (!/[0-9]/.test(value)) {
                                return "Password must contain at least one number";
                            }

                            if (!/[^A-Za-z0-9]/.test(value)) {
                                return "Password must contain at least one special character";
                            }

                            return null;
                        }}
                    >
                        <Label>Password</Label>

                        <div className="flex flex-col gap-4">
                            <div className="relative flex-1">
                                <Input
                                    className="w-full"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    type="button"
                                    variant="ghost"
                                    className="absolute text-blue-400 right-1 top-1/2 -translate-y-1/2"
                                    onPress={() => setShowPassword((prev) => !prev)}
                                >
                                    {showPassword ? (
                                        <EyeSlash className="size-4" />
                                    ) : (
                                        <Eye className="size-4" />
                                    )}
                                </Button>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    // variant="secondary"
                                    aria-label={
                                        password ? "Regenerate password" : "Generate password"
                                    }
                                    onPress={handleGeneratePassword}
                                >
                                    {password ? "Regenerate Password" : "Generate Password"}
                                    <ArrowRotateRight />
                                </Button>

                                <Button
                                    isIconOnly
                                    type="button"
                                    variant="secondary"
                                    aria-label="Copy password"
                                    isDisabled={!password}
                                    onPress={handleCopyPassword}
                                >
                                    <Copy />
                                </Button>
                            </div>
                        </div>

                        <FieldError />
                    </TextField>
                </FieldGroup>

                <Fieldset.Actions>
                    <Button type="submit">
                        <FloppyDisk />
                        Create account
                    </Button>

                    <Button
                        type="reset"
                        variant="secondary"
                    >
                        Cancel
                    </Button>
                </Fieldset.Actions>
            </Fieldset>
        </Form>
    );
};

export default SignUpPage;