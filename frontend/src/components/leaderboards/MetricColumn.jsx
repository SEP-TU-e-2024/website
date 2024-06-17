import LeaderboardColumn from './LeaderboardColumn'

class MetricColumn extends LeaderboardColumn {
    /**
     * Construct column for a metric.
     * 
     * @param {JSON} metric to create column for.
     */
    constructor(metric, resultsFromEntry=(entry) =>  {return entry.results; }) {
        // Construct the column based on the metric values
        super(metric.label, (entry) => {

        // Format the data of the scoring metric with score and unit
        return metric.name in resultsFromEntry(entry) ? 
            `${resultsFromEntry(entry)[metric.name]}${metric.unit}`: 
            '*'
        })
    }
}
export default MetricColumn;