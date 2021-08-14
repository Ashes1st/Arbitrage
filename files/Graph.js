
class Pair {
    nameTokenFrom;
    nameTokenTo;
    addressPair;
    // reserv1
    // reserv2
}

class Token {
    name;
    pairIndexes;
    constructor(_name){
        this.name = _name;
        this.pairIndexes = [];
    }
}

class Graph {
    tokens; // index => Token 
    nameTokens; // index => token name correlation
    
    constructor() {
        this.tokens = [];
        this.nameTokens = [];
    }

    addToken(name){
        if(this.nameTokens.indexOf(name) == -1){
            this.tokens.push(new Token(name));
            this.nameTokens.push(name);
        } else {
            // console.log("Token with name %s alredy exist", name);
        }
        
    }

    addEdge(nameTokenFrom, nameTokenTo){
        if((this.nameTokens.indexOf(nameTokenFrom) != -1) || (this.nameTokens.indexOf(nameTokenTo) != 1)) {
            if(this.tokens[this.nameTokens.indexOf(nameTokenTo)].pairIndexes.indexOf(this.nameTokens.indexOf(nameTokenFrom)) == -1){
                this.tokens[this.nameTokens.indexOf(nameTokenFrom)].pairIndexes.push(this.nameTokens.indexOf(nameTokenTo));
                this.tokens[this.nameTokens.indexOf(nameTokenTo)].pairIndexes.push(this.nameTokens.indexOf(nameTokenFrom));
            }
            
        } else {
            // console.log("One of tokens is not exist");
        }
        
    }


    nameStartDFSToken = ""
    allCount = 0;
    path = []
    dfs(index, checkedTokens, count){
        
        
        checkedTokens.push(index);
        for (let i = 0; i < this.tokens[index].pairIndexes.length; i++) {
            const newIndex = this.tokens[index].pairIndexes[i];
            
            // console.log('\n' + checkedTokens + " checked indexes");
            // console.log(newIndex + " - " + checkedTokens.indexOf(newIndex));

            // console.log(newIndex);
            if(this.nameTokens[newIndex] == this.nameStartDFSToken) { // Path was found
                this.path.push(this.tokens[newIndex].name);
                if(count > 1) {
                    // this.nameTokens[newIndex] == this.nameStartDFSToken
                    // console.log(checkedTokens + " = " + newIndex + " path is: " + this.path);
                    this.allCount++;
                }
                this.path.pop();
                continue;
            }
            
            
            
            if(checkedTokens.indexOf(newIndex) == -1){
                this.path.push(this.tokens[newIndex].name);
                count++;
                // console.log(newIndex + " - new index\n");
                this.dfs(newIndex, checkedTokens, count);
                count--;
                this.path.pop();
            }
            
        }
        checkedTokens.splice(checkedTokens.indexOf(index), 1);
    }

    findAllPathFor(nameStartToken) {
        this.nameStartDFSToken = nameStartToken;
        var checked = [];
        var currentIndex = this.nameTokens.indexOf(nameStartToken);
        var countPathTokens = 0;
        this.path.push(this.tokens[currentIndex].name);
        checked.push(currentIndex);
        // checked.push(currentIndex);
        for (let i = 0; i < this.tokens[currentIndex].pairIndexes.length; i++) {
            const element = this.tokens[currentIndex].pairIndexes[i];
            // checked.push(element);

            
            this.path.push(this.tokens[element].name);
            countPathTokens++;
            this.dfs(element, checked, countPathTokens);
            countPathTokens--;
            this.path.pop();
            // checked.pop(element);
        }
        
        // console.log(this.allCount);
        let returned = this.allCount;
        this.allCount = 0;
        return returned;
    }

    updatePrices() {
        
    }

}

module.exports.Graph = Graph;