import { Link } from 'react-router-dom';
import './home.css';

const Home = () => {
    const names = ['Fynn', 'Behrad', 'Linus', 'Jasper'];

    return (
        <div className="home-container">
            <h1>Wähle eine Person</h1>
            <div className="button-grid">
                {names.map((name) => (
                    <div key={name}>
                        <Link to={`/detail/${name}`}>
                            <button className="name-button">{name}</button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
