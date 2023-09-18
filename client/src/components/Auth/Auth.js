import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";
import styled from "styled-components";

const StyledAuthContainer = styled.div`
	max-width: 500px;
	margin-left: auto;
	margin-right: auto;
`;

const Auth = () => {
	const [login, setLogin] = useState(true);
	const [register, setRegister] = useState(false);
	return (
		<StyledAuthContainer>
			{login && <Login />}
			{register && <Register />}
		</StyledAuthContainer>
	);
};

export default Auth;
