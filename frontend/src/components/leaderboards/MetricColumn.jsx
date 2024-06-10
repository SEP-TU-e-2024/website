import LeaderboardColumn from './LeaderboardColumn'

class MetricColumn extends LeaderboardColumn {
    // TODO remove when metric model has been added:
    // Assuming metric JSON has format {key:'scoring_metric', label:'Scoring metric', unit:'s'}

    /**
     * Construct column for a metric.
     * 
     * @param {JSON} metric to create column for.
     */
    constructor(metric) {
        // Construct the column based on the metric values
        super(metric.label, (entry) => {

        // Format the data of the scoring metric with score and unit
        return `${entry.results[metric.name]}${metric.unit}`
        })
    }
}
export default MetricColumn;