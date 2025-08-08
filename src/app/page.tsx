import Listings from '../../pages/listings';
import Loader from "../../components/loader/Loader";
import { usePageLoader } from "../../hooks/usePageLoader";

const HomePage = () => {
  const loading = usePageLoader(3000);

  return (
    <div>
      loading ? <Loader /> : <Listings />;
    </div>
  );
};

export default HomePage;