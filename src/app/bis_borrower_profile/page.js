import BISBorrowerProfile from '../../../components/BIS/BISBorrowerProfile';

export default function BorrowerProfilePage({ params }) {
  return <BISBorrowerProfile borrowerId={params.borrowerId} />;
}