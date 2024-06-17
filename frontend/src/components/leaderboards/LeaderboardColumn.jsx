
class LeaderboardColumn {
    /** Column name that can be used as key and is default header */
    #name;
    
    /** Heaer display of the column */
    #header;
    
    /** Private method to get cell data for the column from an entry */
    #getDataFromEntry;
  
    /**
     * Construct column for a leaderboard
     * 
     * @param {string} name of column that is unique and displayable
     * @param {function(JSON)} getDataFromEntry function to get cell data from an entry
     * @param {string} header string to display for the column, is set to name if left undefined.
     */
    constructor(name, getDataFromEntry, header=undefined) {
      this.#name = name;
      this.#getDataFromEntry = getDataFromEntry;
      this.#header = header ?? name;
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
        return this.#header;
    }
}
export default LeaderboardColumn;