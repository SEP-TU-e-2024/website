import {React} from "react"
import ProblemOccurrenceOverviewHeader from "./ProblemOccurrenceOverviewHeader";
import ProblemOccurrenceOverviewBody from "./ProblemOccurrenceOverviewBody";
import api from "../../api";
import { useLoaderData } from "react-router-dom";

/**
 * Page component for a problem occurence overview.
 */
function ProblemOccurrenceOverviewPage() {
  const POData = useLoaderData();
  
  console.log(POData);
  
  return (
    <div>
      <ProblemOccurrenceOverviewHeader />
      <ProblemOccurrenceOverviewBody />
    </div>
  )
};

// export async function loader(occurenceId) {
//   const POInfo = await getPOInfo(occurenceId);
//   return { POInfo };
// }

/**
 * Async function to fetch the problem occurrence data from the backend
 * @returns response data
 */
export async function getPOInfo(occurenceId) {
  const response = await api.post('/problems/occurrence_overview', {POId : occurenceId}); 
  // console.log(response.data);
  return response.data;
}
export default ProblemOccurrenceOverviewPage;
