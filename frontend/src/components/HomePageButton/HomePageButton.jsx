import './HomePageButton.css';



function HomePageButton({title, icon, isActive}) {

    const active = isActive? 'active' : "";

    return (
        <button className={`home-page-button ${active}`}>
            <span className="button-title">{title}</span>
            <span className="button-icon">{icon}</span>
        </button>
    )
}

export default HomePageButton;
