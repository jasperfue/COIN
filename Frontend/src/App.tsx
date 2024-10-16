import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetailPage from './DetailPage';
import Home from "./Home.tsx";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/detail/:name" element={<DetailPage />} />
            </Routes>
        </Router>
    );
};

export default App;
