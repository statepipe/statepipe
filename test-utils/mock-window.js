import node from "./mock-node"
export default node({
  MutationObserver:  class MO {
      constructor(fn){
        this.fn = fn
        return {
          observe: (n) => {
            return {
              disconnect: function(){
                return true
              }
            }
        }
      }
    }
    mutate(attrName, node, nds, rnds){
      nds = nds || []
      rnds = rnds || []
      return this.fn([{attributeName:attrName, target:node, addedNodes:nds, removedNodes:rnds}])
    }
  }
})
