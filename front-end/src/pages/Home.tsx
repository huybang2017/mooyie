import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const Home = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Mooyie</h1>
      <p className="text-xl text-muted-foreground mb-8">
        Your ultimate movie booking experience
      </p>
      
      <div className="flex justify-center space-x-4">
        <Link to="/movies">
          <Button size="lg">Browse Movies</Button>
        </Link>
        <Link to="/register">
          <Button variant="outline" size="lg">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Home; 