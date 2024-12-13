import './HomePageButton.css';
import { useNavigate } from 'react-router-dom';



function HomePageButton({path, title, icon}) {
    const navigate = useNavigate;

    const handleClick = () => {
        navigate(path)
    };

    return (
        <button className="home-page-button" onClick={handleClick}>
            <span className="button-title">{title}</span>
            <span className="button-icon">{icon}</span>
        </button>
    )
}

export default HomePageButton;
