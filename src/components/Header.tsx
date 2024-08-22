import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    problemNum: number;
    is_admin: boolean;
    is_grading_page: boolean;
}


const Header: React.FC<HeaderProps> = ({ problemNum, is_admin, is_grading_page }) => {
    const navigate = useNavigate();
    return (
        <div style={{display: 'flex', flexDirection: 'row', alignContent: 'flex-start', alignItems: 'center'}}>
				<h1>課題{problemNum}確認ページ</h1>
				{is_admin && <button style={{marginLeft: '20px', height: '30px', }} onClick={() => {
                        if (is_grading_page) {
                            navigate(`/submission/${problemNum}`);
                        } else {
                            navigate(`/admin/grading/${problemNum}`);
                        }
                    }}>{is_grading_page ? '課題ページへ' : '採点ページへ'}</button>}
			</div>
    );
}

export default Header;

