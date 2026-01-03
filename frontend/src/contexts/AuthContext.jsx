import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser, getToken, isAuthenticated } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuth, setIsAuth] = useState(false);

	useEffect(() => {
		// Initialize auth state from localStorage
		const authenticated = isAuthenticated();
		setIsAuth(authenticated);

		if (authenticated) {
			const userData = getUser();
			setUser(userData || {});
		}

		setIsLoading(false);
	}, []);

	const value = {
		user: user || {},
		isAuth,
		isLoading,
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
