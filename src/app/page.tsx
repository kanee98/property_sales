import Listings from '../../pages/listings';
import LoaderLayout from '../../components/loader/LoaderLayout';

const HomePage = () => {
  return(
    <LoaderLayout>
      <Listings />
    </LoaderLayout>
  )
};

export default HomePage;