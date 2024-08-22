
import { useParams, useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import {useAuth} from '../context/AuthContext';
import Header from '../components/Header';


const Grading = () => {
    const { problemNum } = useParams<{ problemNum: string }>();
    const auth = useAuth();
    const navigate = useNavigate();
	return (
		<div style={{ paddingBottom: '100px'}}>
			<div style={{display: 'flex', flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center'}}>
                <Header problemNum={Number(problemNum)} is_admin={auth.is_admin} is_grading_page={true} />
			</div>
		</div>
	)
}

export default Grading;