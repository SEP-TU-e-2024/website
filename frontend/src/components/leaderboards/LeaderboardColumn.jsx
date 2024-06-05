
class LeaderboardColumn {
    /** Column name that can be used as key or header display */
    #name;
    
    /** Private method to get cell data for the column from an entry */
    #getDataFromEntry;
  
    /**
     * Construct column for a leaderboard
     * 
     * @param {string} name of column that is unique and displayable
     * @param {function(JSON)} getDataFromEntry function to get cell data from an entry
     */
    constructor(name, getDataFromEntry) {
      this.#name = name;
      this.#getDataFromEntry = getDataFromEntry;
    }
  
    /**
     * Get column data from the specified entry data
     * 
     * @param {JSON} entry data to retrieve column data from
     * @return {*} data to display in the column entry cell
     */
    getData(entry) {
      return this.#getDataFromEntry(entry);
    }
  
    /**
     * Get the name of the column
     * 
     * @return {string} Name of the column
     */
    get name() {
      return this.#name;
    }
    
    /**
     * 
     * @returns 
     */
    getHeader() {
        return this.name;
    }
}
export default LeaderboardColumn;