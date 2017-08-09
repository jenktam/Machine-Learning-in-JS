
//Start off with what passes the first test.
//Kth-Nearest Neighbors
function KNN(kSize){
	this.kSize = kSize;
	this.points = [];
}

KNN.prototype = {

	train: function(dataPoints){
		this.points = this.points.concat(dataPoints)
	},

	_distance: function(vector1, vector2){
		return this.euclideanNorm(this.vectorSub(vector1, vector2))
	},

	_distances: function(point, points){
		var self = this;

		return points.map(function(n){
			var distance = self._distance(point, n[0]);
			return [distance, n[1]];
		});
	},

	euclideanNorm: function(arr) {
		return Math.sqrt(arr.reduce((acc, elem) => {
			return acc + elem * elem
		}, 0))
	},

	vectorSub: function(arr1, arr2) {
		return arr1.map( (_, index) => {
			return arr1[index] - arr2[index]
		})
	},

	//returns classications sorted in ascending distances order
	// Example Output: [1,0,1,0,2,3,2,1,1,2,2,0,0]
	_sorted: function(arrOfSubArrs){
		return arrOfSubArrs.sort( (a, b) => {
			if( a[0] < b[0]) return -1
			else return 1
		}).map( elem => elem[1])
	},

	_majority: function(k, classSortedByDists) {
		let hash = {};
		const kNeighbors = classSortedByDists.slice(0, k)

		kNeighbors.forEach( neighbor => {
			if(!hash[neighbor]) hash[neighbor] = 1
			else hash[neighbor] += 1
		})

		const reducer = Object.keys(hash).reduce( (accum, elem) => {
			return hash[accum] > hash[elem] ? accum : elem
		})

		return Number(reducer);
	},

	predictSingle: function(vector) {
		const distancesArray = this._distances(vector, this.points)
		const sortedArray = this._sorted(distancesArray);
		const majority = this._majority(this.kSize, sortedArray);

		return majority
	},

	predict: function(vectorArray) {
		return vectorArray.map( vector => this.predictSingle(vector))
	},

	//returns number 1 - 0
	score: function(realData) {
		const vectors = realData.map( point => point[0])
		const predictions = this.predict(vectors)
		const classications = realData.map( point => point[1])

		let matches = this.vectorSub(predictions, classications)
		matches = matches.filter( match => {
			return match === 0
		})
		const frequency = matches.length / classications.length

		return frequency
	}
}

module.exports = KNN
