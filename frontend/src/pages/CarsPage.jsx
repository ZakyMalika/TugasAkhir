import CarCatalog from '../components/CarCatalog';

const CarsPage = ({ cars, loading }) => {
  return (
    <div style={{ paddingTop: '100px' }}>
      <CarCatalog cars={cars} loading={loading} />
    </div>
  );
};

export default CarsPage;
